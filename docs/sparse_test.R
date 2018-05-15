dense.spline.train = "
arma::mat test1 (arma::mat Z, arma::mat X, arma::mat y)
{
  return Z * X * y;
}
"
sparse.spline.train = "
arma::mat test2 (arma::mat Z, arma::sp_mat X, arma::mat y)
{
  // Brackets are important due to CSC format:
  return Z * (X * y);
}
"

Rcpp::cppFunction(code = dense.spline.train, depends = "RcppArmadillo", rebuild = TRUE)
Rcpp::cppFunction(code = sparse.spline.train, depends = "RcppArmadillo", rebuild = TRUE)

n = 100000
p = 40

Z = matrix(runif(p^2), p, p)

X = matrix(0, nrow = n, ncol = p)
X[1:n, sample(1:p, 5)] = rnorm(10000 * 5)

y = matrix(runif(n), nrow = n, ncol = 1)
betas = matrix(runif(p), nrow = p, ncol = 1)

library(Matrix)
X.sparse = as(X, "sparseMatrix")

all.equal(test1(Z, t(X), y), test2(Z, t(X.sparse), y))

# Equivalent to spline train:
microbenchmark::microbenchmark(
  "dense spline train"  = test1(Z, t(X), y),
  "sparse spline train" = test2(Z, t(X.sparse), y)
)
