const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com`;

export const uploadToR2 = async (file, folder = 'uploads') => {
  const { createHash } = await import('crypto');
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const hash = createHash('md5').update(`${timestamp}-${randomString}`).digest('hex');
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${hash}.${ext}`;

  const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = date.substring(0, 8);
  
  const credential = `${R2_ACCESS_KEY_ID}/${dateStamp}/auto/s3/aws4_request`;
  
  const payloadHash = 'UNSIGNED-PAYLOAD';
  
  const headers = {
    'host': `${R2_BUCKET_NAME}.r2.cloudflarestorage.com`,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': `${date}Z`
  };

  const sortedHeaders = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k.toLowerCase()}:${v}`)
    .join('\n');

  const signedHeaders = Object.keys(headers).sort().join(';');

  const canonicalRequest = [
    'PUT',
    `/${fileName}`,
    '',
    sortedHeaders,
    '',
    signedHeaders,
    payloadHash
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    `${date}Z`,
    `${dateStamp}/auto/s3/aws4_request`,
    createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const hmac = (...args) => {
    let h = args.shift();
    while (args.length) {
      const d = args.shift();
      h = createHash('sha256').update(h, d).digest();
    }
    return h;
  };

  const sign = (key, ...args) => hmac(Buffer.from(key, 'utf8'), ...args);
  
  const kDate = sign(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp);
  const kRegion = sign(kDate, 'auto', 's3');
  const kService = sign(kRegion, 's3');
  const signingKey = sign(kService, 'aws4_request');

  const signature = createHash('sha256').update(Buffer.from(stringToSign, 'utf8')).update(signingKey).digest('hex');
  
  const authorization = `AWS4-HMAC-SHA256 Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`${R2_PUBLIC_URL}/${fileName}`, {
    method: 'PUT',
    headers: {
      'Authorization': authorization,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': `${date}Z`,
      'Content-Type': file.type || 'application/octet-stream',
      'Content-Length': file.size
    },
    body: file.buffer
  });

  if (!response.ok) {
    throw new Error(`R2 upload failed: ${response.statusText}`);
  }

  return {
    key: fileName,
    url: `${R2_PUBLIC_URL}/${fileName}`
  };
};

export const deleteFromR2 = async (key) => {
  const { createHash } = await import('crypto');
  
  const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = date.substring(0, 8);
  
  const credential = `${R2_ACCESS_KEY_ID}/${dateStamp}/auto/s3/aws4_request`;
  const payloadHash = 'UNSIGNED-PAYLOAD';
  
  const headers = {
    'host': `${R2_BUCKET_NAME}.r2.cloudflarestorage.com`,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': `${date}Z`
  };

  const sortedHeaders = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k.toLowerCase()}:${v}`)
    .join('\n');

  const signedHeaders = Object.keys(headers).sort().join(';');

  const canonicalRequest = [
    'DELETE',
    `/${key}`,
    '',
    sortedHeaders,
    '',
    signedHeaders,
    payloadHash
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    `${date}Z`,
    `${dateStamp}/auto/s3/aws4_request`,
    createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const hmac = (...args) => {
    let h = args.shift();
    while (args.length) {
      const d = args.shift();
      h = createHash('sha256').update(h, d).digest();
    }
    return h;
  };

  const sign = (key, ...args) => hmac(Buffer.from(key, 'utf8'), ...args);
  
  const kDate = sign(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp);
  const kRegion = sign(kDate, 'auto', 's3');
  const kService = sign(kRegion, 's3');
  const signingKey = sign(kService, 'aws4_request');

  const signature = createHash('sha256').update(Buffer.from(stringToSign, 'utf8')).update(signingKey).digest('hex');
  
  const authorization = `AWS4-HMAC-SHA256 Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  await fetch(`${R2_PUBLIC_URL}/${key}`, {
    method: 'DELETE',
    headers: {
      'Authorization': authorization,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': `${date}Z`
    }
  });
};
