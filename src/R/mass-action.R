install.packages("escape2024", repos = c("https://jgf5013.r-universe.dev", "https://cloud.r-project.org"))
library(escape2024)

installed_packages <- installed.packages()
package_info <- data.frame(
  Package = installed_packages[, "Package"],
  LibPath = installed_packages[, "LibPath"]
)
print(jsonlite::toJSON(package_info))

list_directories <- function(path) {
  all_files <- list.files(path, include.dirs = TRUE, recursive = FALSE)
  dirs <- all_files[file.info(file.path(path, all_files))$isdir]
  return(dirs)
}

print(".libPaths():")
r_library_path = .libPaths()
print(r_library_path)

# mass_action_seir <- function(R_o, population_size, initial_exposed = 1, initial_infected = 1, time_steps = 1000, gamma = 1/14, sigma = 1/5) {

#   # Input validation
#   if (R_o < 0 || R_o > 20) {
#     stop("R_o must be between 0 and 20.")
#   }
#   if (population_size <= 0) {
#     stop("Population size must be positive.")
#   }
#   if (initial_exposed < 0 || initial_infected < 0) {
#       stop("Initial exposed and infected must be non-negative")
#   }
  
#   # Initialize state variables (same as before)
#   S <- population_size - initial_exposed - initial_infected
#   E <- initial_exposed
#   I <- initial_infected
#   R <- 0

#   # Initialize output list
#   output_list <- list()

#   # Simulation loop (same as before, but store in list)
#   for (t in 1:time_steps + 1) {
#     beta <- R_o * gamma
#     dS <- -beta * S * I / population_size
#     dE <- beta * S * I / population_size - sigma * E
#     dI <- sigma * E - gamma * I
#     dR <- gamma * I

#     S_new <- S + dS
#     E_new <- E + dE
#     I_new <- I + dI
#     R_new <- R + dR

#     new_cases <- I_new - I
#     recovered <- R_new - R

#     output_list[[t]] <- list(time = t, new_cases = new_cases, recovered = recovered)
#     json_output <- jsonlite::toJSON(output_list[[t]], pretty = TRUE)
#     cat(paste(json_output, collapse = NULL))
#     flush.console()

#     S <- S_new
#     E <- E_new
#     I <- I_new
#     R <- R_new

#     Sys.sleep(0.1)
#   }
# }

R_o <- 2.5
population_size <- 1000000
# mass_action_seir(R_o, population_size)
print("Calling model_reference...")

result = tryCatch({
  data <- model_reference(
    transmission_rate = 0.25,
    infectiousness_rate = 0.1,
    recovery_rate = 0.2,
    time_end = 2,
    population_size = 1,
    seed_infected = 1E-3,
    increment = 1
  )
  print(data)
  flush.console()
  return(data)
}, warning = function(w) {
  print("Warning...")
  print(w)
}, error = function(e) {
  print("Error...")
  print(e)
}, finally = {
  print("All done!")
  flush.console()
})

# json_output <- jsonlite::toJSON(data, pretty = TRUE)