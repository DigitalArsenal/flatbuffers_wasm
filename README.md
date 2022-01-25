# WASI_BUILD_SYSTEM

## flatbuffers

- [x] Requires [wasienv](https://github.com/wasienv/wasienv) for shims
- [ ] Experiment with capturing stdout (fd === 1) instead of cutting a new process

## Flatbuffers

TODO: replace util.cpp mkdir
```

void EnsureDirExists(const std::string &filepath) {
  return;
  auto parent = StripFileName(filepath);
  if (parent.length()) EnsureDirExists(parent);
    // clang-format off

  #ifdef _WIN32
    (void)_mkdir(filepath.c_str());
  #else
    mkdir(filepath.c_str(), S_IRWXU|S_IRGRP|S_IXGRP);
  #endif
  // clang-format on
}

```
## Sqlite3