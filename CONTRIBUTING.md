# Contributing

We welcome and encourage community contributions to our projects. This document
specifies the guidelines for contributing to the projects that are created under
the **lottojs** organization. We've split this document in smaller sections:

- [Feature Requests](#feature-requests)
- [Questions](#questions)
- [Issues](#issues)
  - [Outline of a good bug report](#outline-of-a-good-bug-report)
  - [Labels](#labels)
- [Code](#code)
  - [Commits](#commits)
  - [Branch Naming](#branch-naming)
- [Code of Conduct](#code-of-conduct)

There are always many ways you can help out this project besides contributing
to the code:

- Writing and improving our documentation.
- Searching for potential memory leaks, event loops blocks and de-optimized code.
- Filing bugs.

And that list goes on and on. No matter what you choose we are thankful for your interest and for the fact that you want to contribute to our projects. They are build and maintained with love and we hope to share some of that love with you.

## Feature Requests

Yes! Make them! We would love to hear your idea(s) and what we can do to continue to move this project forward. Changes, big or small, are always welcomed. If the feature requested is not in line with our roadmap we will work with you to ensure that you can build it yourself on top of our project.

## Questions

When you're first starting out, you're bound to have questions about this project. We hope that our documentation at [lottojs.tech](https://lottojs.tech) provides answers to all your questions. In rare cases when the documentation does not answer your question you could:

1. Create an issue on GitHub thoroughly explaining your issue. The more information you provide us with, the better we can help you.

We will do our best to answer your questions in a timely manner. Please note that if you create a new issue and put everything in the title with no explanation in the body, it will be closed and locked immediately and you'll be prompted to follow the instructions contained in this file.

## Issues

Before creating an issue make sure that you are using the latest version of the module as the issue you report could be already resolved. If you are using the latest version please use the Github search feature to check if the issue is already known. If you've found an issue that is:

- **closed:** Check if the issue provides a solution for your issue. If it's already fixed using a commit it could be that there have been a regression in the code. In this case it's best to open a new issue. For all other cases it might make more sense to just add comment to the closed issue explaining that you're still affected by this.
- **open:** Try to provide more details to the issue. If you can reproduce the issue in a different way than the one used by the original author, please add this. The more ways we have to reproduce the bug, the more are the chances to get it fixed fast.
- **missing:** Please open a new issue, we would love to hear more about it.

### Outline of a good bug report

When reporting new issues for the project please use the following issue template so you know what kind of data you need to supply and we can resolve it as quickly as possible. If some of these fields do not apply to your issue feel free to leave them empty or remove them completely:

```
**Version:**

**Environment:**
  - **Operating system**:
  - **browser**:
  - **Nodejs**:
  - **npm**:

**Expected result:**

**Actual result:**

**Steps to reproduce:**

1. Step 1.
2. Step 2.
3. Things are broken.

**Aditional Context:**
```

Here is a small explanation of the fields and what kind of information could be present in them.

- **Version:** The version number of the module that you're currently using. If you don't know the current version number you can check it by running `npm ls` in your terminal.
- **Environment:** This allows us to narrow down the issue to a potential platform or version if we cannot reproduce it on our own machines. If you don't know your npm and node.js version you can run `npm version` in your terminal and it will output all the information you need. If you are reporting a node.js specific bug you can omit the browser field unless it requires a browser to reproduce it.
- **Expected result:** What did you expect would happen.
- **Actual result:** What actually happened when you executed the code.
- **Steps to reproduce:** Every step to fully reproduce the issue is described here, no matter how small. You cannot be specific enough. It's better to have too much details than too few here.

A complete example of this would be:

```
Version: 0.1.2
Environment:
  - Operating System: macOS Ventura 13.5.1 (22G90)
  - Node:18.15.0
  - npm: 9.5.0

Expected result: A `console.log` message in the terminal.

Actual result: An empty console without any log messages.

Steps to reproduce:

// Piece of Code here.

1. Copy the code I provided.
2. runs: `node your_file_name.js`.
3. Press enter to execute the code.
```

When adding code to your example please use [code fencing][fencing] to ensure
that your snippet is highlighted correctly. This greatly improves the
readability of the issue.

### Labels

We try to label all created issues to facilitate the identification of the issue scope.

The labels are:

- [BUG]
- [FEATURE]
- [QUESTION]

## Code

Unless you are fixing a known bug we **strongly** encourage to discuss your feature with the core team via a GitHub issue. Before getting started ensure that your work will not be rejected.

All contributions must be made via pull requests. After a pull request is made other contributors will either provide feedback or merge it directly depending on:

- Addition of new tests and passing of the test suite.
- Code coverage.
- The severity of the bug that the code is addressing.
- The overall quality of patch.

We expect that every bug fix comes with new tests for our test suite. This is important to prevent regression in the future as our current set of tests did not trigger the code path.

### Commits

We follow the Conventional Commits specification, so please try to follow it as much as you can to don't have your pull request declined.

**Examples**:

- Commit implementing a new feature:
    - `feat: implements /users/:id route`
- Commit message documents update:
    - `docs: updates README.md`
- Commit doing a fix:
    - `fix: fixing problem with status code on route ...`

And so on, see more at [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)


### Branch Naming

Make sure when contributing to follow our branch namming pattern.

We have some prefixes and you can take a look here:

- **Bugfix**: fix/work_you_are_doing
- **Feature**: feat/work_you_are_doing
- **Improvement**: imp/work_you_are_doing
- **Tests**: test/work_you_are_doing

**Examples:**

- Fixing something: `fix/broken_middlewares`
- New Feature: `feat/cors_middleware`
- Improvement: `imp/lotto_core`
- Adding tests: `test/router`

## Code of Conduct

- We are committed to providing a friendly, safe and welcoming environment for all, regardless of gender, sexual orientation, disability, ethnicity, religion,  or similar personal characteristic.
- Please be kind and courteous. There's no need to be mean or rude.
- Respect that people have differences of opinion and that every design or implementation choice carries a trade-off and numerous costs. There is seldom a right answer.
- Please keep unstructured critique to a minimum. If you have solid ideas you want to experiment with, make a fork and see how it works.
- We will exclude you from interaction if you insult, demean or harass anyone. That is not welcome behaviour.
- Private harassment is also unacceptable. No matter who you are, if you feel you have been or are being harassed or made uncomfortable by a community member, please contact us.
- Likewise any spamming, trolling, flaming, baiting or other attention-stealing behaviour is not welcome.

[fencing]: https://help.github.com/articles/github-flavored-markdown/#fenced-code-blocks
