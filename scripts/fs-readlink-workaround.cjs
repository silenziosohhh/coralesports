const fs = require("node:fs");

function normalizeReadlinkError(error, path) {
  if (error?.code !== "EISDIR") return error;

  try {
    fs.lstatSync(path);
    error.code = "EINVAL";
  } catch {

  }

  return error;
}

const originalReadlink = fs.readlink.bind(fs);
fs.readlink = (path, options, callback) => {
  const hasOptions = typeof options !== "function";
  const done = hasOptions ? callback : options;
  const wrapped = (error, linkString) => done(normalizeReadlinkError(error, path), linkString);

  return hasOptions ? originalReadlink(path, options, wrapped) : originalReadlink(path, wrapped);
};

const originalReadlinkSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = (path, options) => {
  try {
    return originalReadlinkSync(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error, path);
  }
};

const originalPromiseReadlink = fs.promises.readlink.bind(fs.promises);
fs.promises.readlink = async (path, options) => {
  try {
    return await originalPromiseReadlink(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error, path);
  }
};
