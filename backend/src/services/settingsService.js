import Settings from '../models/Settings.js';

let cachedSettings = null;

export const getSettings = async () => {
  if (cachedSettings) {
    return cachedSettings;
  }
  
  let settings = await Settings.findOne();
  
  if (!settings) {
    settings = await Settings.create({});
  }
  
  cachedSettings = settings;
  return settings;
};

export const updateSettings = async (data) => {
  const settings = await Settings.findOneAndUpdate(
    {},
    data,
    { new: true, upsert: true, runValidators: true }
  );
  
  cachedSettings = settings;
  return settings;
};

export const clearSettingsCache = () => {
  cachedSettings = null;
};
