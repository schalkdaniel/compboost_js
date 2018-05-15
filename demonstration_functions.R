compboost = function (...) 
{
  Sys.sleep(1)
  out = list("compboost")
  class(out) = "compboost"
  
  return (out)
}

generateCboostAppData = function (cboost, dir)
{
  message("Generating app data into: ", dir, "\n")
  pb <- txtProgressBar(min = 1, max = 100, style = 3)
  for (i in seq_len(100)) {
    Sys.sleep(0.02)
    setTxtProgressBar(pb, i)
  }
  close(pb)
  utils::browseURL("index.html")
}

plot.compboost = function (object, learner, at)
{
  plot.data = read.csv(
    file = paste0(
      "plot_data/effects/", 
      stringr::str_replace_all(string = learner, pattern = " ", replacement = ""),
      ".csv"
    )
  )
  
  var = strsplit(learner, " ")[[1]]
  var = var[length(var)]
  
  ggplot(data = plot.data, aes(x, y)) + 
    geom_line() + 
    theme_bw() +
    labs(title = learner,
      subtitle = paste0("Plottet at iteration ", at)) +
    xlab(var) +
    ylab("")
}

