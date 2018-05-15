set.seed(123)

# Simulate effects:
# --------------------------------

bl.type = sample(c("Linear", "Spline with degree 3", "Polynomial"))
bl.names = c("GenderMale", "Income", "Height", "Longitude", "Latitude", "RiskGroup",
  "GenderFemale", "Age", "Duration", "Wealth", "Depth", "Pressure", "Temperature",
  "City", "Country", "Experience", "Education", "Travel")
bl.names = paste0(sample(bl.type, length(bl.names), TRUE), " ",bl.names)

bl = sample(bl.names, 1500, TRUE)

# Write .js file to load the base-learner:
mylines = c(
  "function getBlearner ()",
  "{",
  paste0("  return [", paste( paste0("\"", bl, "\""), collapse = ", "), "];"),
  "}"
)
  
writeLines(mylines, con = "js/blearner.js")

# Simulate data depending on learner:
# -------------------------------------------

dir = "plot_data/effects"

simLinear = function () {
  
  betas = runif(2, -4, 4)
  
  x = runif(100, -10, 10)
  x = seq(from = min(x), to = max(x), length.out = 100)
  y = cbind(1, x) %*% betas
  
  # plot(x, y)
  
  return (list(x, y)) 
}

simPoly = function () {
  
  betas = runif(3, -4, 4)
  
  x = runif(100, -10, 10)
  x = seq(from = min(x), to = max(x), length.out = 100)
  y = cbind(1, x, x^2) %*% betas
  
  # plot(x, y)
  
  return (list(x, y)) 
}

simSplines = function () {
 
  betas = runif(5, -2, 2)
  
  x = runif(100, -2, 2)
  x = seq(from = min(x), to = max(x), length.out = 100)
  y = runif(1, 0, 10) + cbind(x, x^2, x^3, x^4, x^5) %*% betas
  
  # plot(x, y)
  
  return (list(x, y)) 
}



for (i in unique(bl)) {
  
  file.name = stringr::str_replace_all(string = i, pattern = " ", replacement = "")
  
  if (grepl("Linear", i)) { df.temp = simLinear() }
  if (grepl("Spline with degree 3", i)) { df.temp = simSplines() }
  if (grepl("Polynomial", i)) { df.temp = simPoly() }
  
  df.temp = data.frame(x = df.temp[[1]], y = df.temp[[2]])
  write.csv(df.temp, file = paste0(dir, "/", file.name, ".csv"), row.names = FALSE)
}
