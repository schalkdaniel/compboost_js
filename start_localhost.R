mydir = "E:/OneDrive/github_repos/compboost_js"

if (dir.exists(mydir)) {
  localhost = servr::httd(dir = mydir, host = "127.0.0.1", port = 666, 
    daemon = TRUE)
  
  # utils::browseURL(url = "http://127.0.0.1:666")
  # rstudioapi::viewer(url = "http://127.0.0.1:666")
}
if (exists("localhost")) {
  servr::daemon_stop(localhost)
}

utils::browseURL(url = paste0(mydir, "/index.html"))
