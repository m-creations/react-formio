# m-creations dev procedure

- Use mc-dev-4 branch for commits
- Before release, merge into mc-4.0 (or similar)
- In that release branch, then do:
  - ec package.json 
  - npm run prepublish
  - npm run tag
  - npm publish . --registry https://nexus.m-creations.net/repository/npm-hosted/
