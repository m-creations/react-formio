# m-creations dev procedure

- Use mc-dev branch for commits
- Before release, merge into mc-3.1 (or similar)
- In that release branch, then do:
  - ec package.json 
  - npm run prepublish
  - npm run tag
  - npm publish . --registry https://nexus.m-creations.net/repository/npm-hosted/
