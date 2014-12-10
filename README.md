#Catberry homepage

![Catberry](https://raw.githubusercontent.com/catberry/catberry/master/docs/images/logo.png)

##What is it?
It is a repository of Catberry's official web-site that has been written
using [Catberry Framework](https://github.com/catberry/catberry).

You can see deployed web-site at [http://catberry.org](http://catberry.org).

This repository can be useful if you want:

* To see Catberry framework in action
* To learn how to build fast and modular isomorphic web-applications written
in JavaScript using Catberry

##How to run?

Clone it

```bash
git clone https://github.com/catberry/catberry-homepage.git
```

Install dependencies:

```bash
npm install
```

Initialize new config if you do not have one:

```bash
make config
```

Now you can run in debug mode

```bash
npm run debug
```

Or run it in release mode:

```bash
npm start
```

Also you can start it using [PM2](https://github.com/Unitech/PM2) like this:

```bash
make release && pm2 start ./processes.json
```

##Contribution
If you have found a bug, please create pull request with [mocha](https://www.npmjs.org/package/mocha) 
unit-test which reproduces it or describe all details in issue if you can not 
implement test. If you want to propose some improvements just create issue or 
pull request but please do not forget to use `npm test` to be sure that your 
code is awesome.

All changes should satisfy this [Code Style Guide](https://github.com/catberry/catberry/blob/3.2.1/docs/code-style-guide.md).

Also your changes should be covered by unit tests using [mocha](https://www.npmjs.org/package/mocha).

Julia Rechkunova <julia.rechkunova@gmail.com>
Denis Rechkunov <denis.rechkunov@gmail.com>