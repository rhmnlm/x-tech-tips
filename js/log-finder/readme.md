### Log Finder

Log Finder is a javascript file that wraps the original console.log() and show you the exact location where the log happened.
The original post can be found [here](https://twitter.com/wesbos/status/1744386443345088658?t=3JouSib9sh5ZR7Vx8Z7tDQ&s=19)

### Installation

No installation needed. Just import the file in your main file.

### Usage

```javascript
import "./log-finder"
//or
require("./log-finder")

/**
 * output: 
 * your-file.js:2 
 * hello
 */
const a = "hello" //line 1
console.log(a); //line 2
```

### Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

### License

[MIT](https://choosealicense.com/licenses/mit/)