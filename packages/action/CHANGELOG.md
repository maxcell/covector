# Changelog

## [0.2.6]

-   The command sequence was piping to the return correctly, but in publish, we didn't properly concat the text. Fix that.
    -   Bumped due to a bump in covector.
    -   [095fe43](https://www.github.com/jbolda/covector/commit/095fe43d856ff5cf22995d2729afa449ebc3d4e3) fix: proper pipe publish output in action ([#114](https://www.github.com/jbolda/covector/pull/114)) on 2020-07-21

## [0.2.5]

-   Add extra outputs that says which command was run (for `version-or-publish`) and if something was published.
    -   [65aad0f](https://www.github.com/jbolda/covector/commit/65aad0f34ccc3d3b17ce31dda5eb9aaa8efd563f) feat: adjust action output for better follow on step responses ([#111](https://www.github.com/jbolda/covector/pull/111)) on 2020-07-19

## [0.2.4]

-   Increase default timeout and allow it to be set from config.
    -   Bumped due to a bump in covector.
    -   [a80e2ee](https://www.github.com/jbolda/covector/commit/a80e2eecdc21318b9dd93e9a9fe2a5441703fea5) chore: increase default timeout ([#106](https://www.github.com/jbolda/covector/pull/106)) on 2020-07-17

## [0.2.3]

Bumped due to dependency.

## [0.2.3]

-   Fix create release and upload errors on publish.
    -   [f0443c1](https://www.github.com/jbolda/covector/commit/f0443c17e4584b026eecc6c8a5f34b362c02c498) fix: create release on publish ([#100](https://www.github.com/jbolda/covector/pull/100)) on 2020-07-14

## [0.2.2]

Bumped due to dependency.

## [0.2.2]

-   In --dry-run mode, output the expected commands with data piped in.
    -   Bumped due to a bump in covector.
    -   [1bb67ea](https://www.github.com/jbolda/covector/commit/1bb67ea671b6fbe9b21af9feb72612d166fd7662) fix: missing publish pipe ([#94](https://www.github.com/jbolda/covector/pull/94)) on 2020-07-10

## [0.2.1]

-   Shift getPublishedVersion check prior to commands running. Without this, postpublished would never run (since packages were just published and are update to date).
    -   Bumped due to a bump in covector.
    -   [922d224](https://www.github.com/jbolda/covector/commit/922d224c34a4e3e2f711877fe42fddd4faba55ab) fix: getPublishedVersion check shift ([#92](https://www.github.com/jbolda/covector/pull/92)) on 2020-07-10

## [0.2.0]

-   Added new dryRunCommand to specify a different command to run instead in --dry-run mode instead of skipping the specified command.
    -   Bumped due to a bump in covector.
    -   [3ca050c](https://www.github.com/jbolda/covector/commit/3ca050c2c51821d229209e18391535c266b6b200) feat: advanced commands ([#71](https://www.github.com/jbolda/covector/pull/71)) on 2020-07-06
-   Change files were being deleted too quickly for git info to be retrieved. Shift to end of sequence.
    -   Bumped due to a bump in covector.
    -   [85bff4b](https://www.github.com/jbolda/covector/commit/85bff4b146d59a5bc4a093f3e7610d22876d7d0e) fix: delay change file deletion for git info retrieval ([#82](https://www.github.com/jbolda/covector/pull/82)) on 2020-07-09
-   Pull and set git meta information on change files as an array of commits. This can then be piped into changelogs.
    -   Bumped due to a bump in covector.
    -   [cc19486](https://www.github.com/jbolda/covector/commit/cc19486f86b78aec2c719e5dd17a2d72cbc8d450) feat: new command package and piped git info ([#78](https://www.github.com/jbolda/covector/pull/78)) on 2020-07-09
    -   [de3248d](https://www.github.com/jbolda/covector/commit/de3248dfd70146392ff65e7065c2125daf527728) feat: dep bump note in changelog ([#87](https://www.github.com/jbolda/covector/pull/87)) on 2020-07-10
-   Allow complex commands specified as an object. This let's one specify a dryRunCommand that is executed in --dry-run mode instead (so no accidental publishes!) or to set pipe to true that the output is returned from the main covector function. The pipe likely won't be used directly, but can be consumed within the action to create a Github Release, etc.
    -   Bumped due to a bump in covector.
    -   [3ca050c](https://www.github.com/jbolda/covector/commit/3ca050c2c51821d229209e18391535c266b6b200) feat: advanced commands ([#71](https://www.github.com/jbolda/covector/pull/71)) on 2020-07-06
-   Version commands used to only run on changes, but ignore parents. Reconfigure that we resolve the parents and run commands on both direct changes and changes through a dependency.
    -   Bumped due to a bump in covector.
    -   [3ca050c](https://www.github.com/jbolda/covector/commit/3ca050c2c51821d229209e18391535c266b6b200) feat: advanced commands ([#71](https://www.github.com/jbolda/covector/pull/71)) on 2020-07-06
-   Adjust covector publish command to return the pkg as part of the out.
    -   Bumped due to a bump in covector.
    -   [a1ac9f7](https://www.github.com/jbolda/covector/commit/a1ac9f7b03be0a76bf3cfb664f330fc29e5c0c4e) feature: github release on publish ([#76](https://www.github.com/jbolda/covector/pull/76)) on 2020-07-08
-   Split out child_process commands into separate package.
    -   Bumped due to a bump in covector.
    -   [cc19486](https://www.github.com/jbolda/covector/commit/cc19486f86b78aec2c719e5dd17a2d72cbc8d450) feat: new command package and piped git info ([#78](https://www.github.com/jbolda/covector/pull/78)) on 2020-07-09

## [0.1.1]

Bumped due to dependency.

## [0.1.0]

Bumped due to dependency.

## [0.0.3]

Bumped due to dependency.

## [0.0.2]

Bumped due to dependency.
