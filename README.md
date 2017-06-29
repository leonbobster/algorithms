# algorithms

### Karatsuba multiplication

```javascript
let NumberArray = require('./number-array');

let x = NumberArray.of('1234567812345678123456781234567812345678123456781234567812345678');
let y = NumberArray.of('8765432187654321876543218765432187654321876543218765432187654321');

console.log(NumberArray.karatsuba(x, y).toString() === x.mult(y).toString());
console.log(NumberArray.karatsuba(x, y).toString());

// output
true
10821520440176787721383710409995436061537680231209998470431946285474774621551587883554295515927121963112887669545557079622374638
```

### Karger's algorithm (Minimum cut of a Graph) in PHP.

https://en.wikipedia.org/wiki/Karger%27s_algorithm
https://github.com/leonbobster/algorithms/blob/master/kargers_mincut.php

### Counting of comparisons (QuickSort) in PHP.

https://github.com/leonbobster/algorithms/blob/master/quick_sort_comparisons.php
