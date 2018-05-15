train.test = "
arma::mat trainTest (arma::mat X, arma::mat y)
{
  return arma::inv(X.t() * X) * X.t() * y;
}
"

trainTestR = function (X, y) { return (solve(t(X) %*% X) %*% t(X) %*% y) }

Rcpp::cppFunction(code = train.test, depends = "RcppArmadillo", rebuild = TRUE)

n = 50000
p = 40

X = matrix(rnorm(n * p), nrow = n, ncol = p)
y = matrix(runif(n), nrow = n, ncol = 1)

all.equal(trainTest(X, y), trainTestR(X, y))

# Equivalent to spline train:
microbenchmark::microbenchmark(
  "C++"  = trainTest(X, y),
  "R" = trainTestR(X, y)
)



sum.test = "
unsigned int cppSum (unsigned int n)
{
  unsigned int mysum = 0;
  for (unsigned int i = 1; i <= n; i++) {
    mysum += i;
  }
  return mysum;
}
"

rSum = function (n) { 
  mysum = 0
  for (i in seq_len(n)) {
    mysum = mysum + i
  }
  return (mysum)
}

Rcpp::cppFunction(code = sum.test, depends = "RcppArmadillo", rebuild = TRUE)

try = seq(1, 10000000, length.out = 100)

cpp = r = integer(length(try))
pb = txtProgressBar(min = 1, max = 100, style = 3)
k = 1
for (i in try) {
  temp = microbenchmark::microbenchmark(
    "cpp" = cppSum(i),
    "r"   = rSum(i),
    times = 2L
  )
  cpp[k] = median(temp$time[temp$expr == "cpp"])
  k[k]   = median(temp$time[temp$expr == "r"])
  
  setTxtProgressBar(pb, k)
  k = k + 1
}
close(pb)

plot(x = try, y = r, type = "l")
lines(cpp)

plot.runtime = data.frame(
  iteration = rep(try, 2),
  runtime   = c(cpp, r) / 1000^3,
  language  = rep(c("C++", "R"), each = length(try))
)

library(ggplot2)
library(ggtech)

extrafont::loadfonts(device = "win")

ggplot(plot.runtime, aes(x = iteration, y = runtime, color = language)) +
  geom_line(size = 1.5) +
  labs(title = "Summing Up Challenge", subtitle = "C++ vs. R") +
  ylab("Runtime in Seconds") +
  xlab("Iterations") +
  scale_color_tech(theme = "twitter") +
  theme(
    panel.background = element_blank(),
    text             = element_text(family = "Palatino Linotype"),
    legend.title     = element_blank(),
    legend.key       = element_rect(fill = "transparent"),
    panel.grid.major = element_line(color = rgb(0.7, 0.7, 0.7, 0.4),
      size = 0.1, linetype = "dashed")
  )

