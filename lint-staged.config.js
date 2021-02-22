module.exports = {
    "{src,test}/**/*.ts": (filenames) => {
      const targets = filenames.join(" ");
  
      const format = "pretty-quick --staged";
      const lint = `eslint --fix ${targets} --max-warnings 0`;
      const gitAdd = `git add ${targets}`;
  
      return [format, lint, gitAdd];
    },
  };
  