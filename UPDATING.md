# Updating Nimbus

Check ETH Docker and upstream release notes for the image pin in `startos/manifest/index.ts`, supported architectures, flags, network upgrades, and database migrations. Keep the bridge contract between these packages stable or update its consumers in the same change. Build both packages and verify dependency discovery, JWT authentication, peer routing, synchronization, shared volumes, and backup/restore on StartOS.

This package vendors `@start9labs/start-sdk` 4.2.0 from StartOS 0.4.3-rc.2 for shared volumes. Build with Start CLI 3.0 or newer and replace the archive with an appropriate published SDK when available.

The package version is the complete upstream client version followed by the StartOS wrapper revision (`:0`, `:1`, ...). Increment the wrapper revision for package-only changes and reset it to `:0` when changing the upstream version.
