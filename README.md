# R-Virus

## Running Locally
You can run the web app locally by installing node and npm, or by using Dev-Containers. Dev-Containers is the recommended approach if you don't already have node and npm set up.

- Dev Containers (IDE-specific)
  - VS Code
    - Install [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    - Close and reopen the project. VS Code should run some background processes to set up the tooling for you
  - Instructions for other IDEs not given :P
- Install Tools Locally
  - Install [nodeJS](https://nodejs.org/)
  - Run `npm install` from the root directory
  - Run `npm run dev` from the root directory
  - I'm probably missing some steps here...

## Creating the R Library
1. Open an R terminal and execute the steps below.

    ```R
    > install.packages("rwasm")
    > temp_lib <- tempdir()
    > remotes::install_github("r-lib/pak")
    > library(pak) # should not print anything
    > pak::pkg_install("rivm-syso/escape2024", lib = temp_lib)
    > dependencies <- pak::pkg_deps("rivm-syso/escape2024")
    > pak::pkg_install(dependencies, lib = temp_lib) # gives an error?
    > list.files(temp_lib, recursive = TRUE, all.files = TRUE)
    ```

2. Close the terminal - it should prompt you to save the library image
3. Save the library image - it will create a `.RData` file
4. Copy the `.RData` file into the `public/rivm-syso/escape2024` folder