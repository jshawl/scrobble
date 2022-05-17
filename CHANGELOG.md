# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2022-05-16

### Added

- `scrobble` command prints current version
- `scrobble track` command tracks listens

### Removed

- `.env` and `.env.example` for supplying env vars

### Changed

- setup is self-hosted now. The web UI that processes the oauth callback
now also prompts the user to input credentials.

## [1.4.0] - 2022-05-13

### Added

- a `scrobble` command line tool
- `scrobble init` command

### Fixed

- publish to npm with node 18

## [1.3.0] - 2022-05-04

Initial release

[unreleased]: https://github.com/jshawl/scrobble/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/jshawl/scrobble/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/jshawl/scrobble/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/jshawl/scrobble/releases/tag/v1.3.0
