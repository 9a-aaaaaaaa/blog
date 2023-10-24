Rust 标准库中包含一系列被称为 **集合**（*collections*）的非常有用的数据结构。大部分其他数据类型都代表一个特定的值，不过集合可以包含多个值。不同于内建的数组和元组类型，**这些集合指向的数据是储存在堆上的，这意味着数据的数量不必在编译时就已知，并且还可以随着程序的运行增长或缩小**。常见的集合包括：

-   *vector* 允许我们一个挨着一个地储存一系列数量可变的值
-   **字符串**（*string*）是一个字符的集合。
-   **哈希 map**（*hash map*）允许我们将值与一个特定的键（key）相关联。这是一个叫做 *map* 的更通用的数据结构的特定实现。

# `Vec<T>`
也被称为 *vector*。`vector` 允许我们在一个单独的数据结构中储存多于一个的值，它在内存中彼此相邻地排列所有的值。vector 只能储存相同类型的值。

### 创建vec
```rust
let v: Vec<i32> = Vec::new();
```
向这个 vector 中插入任何值，Rust 并不知道我们想要储存什么类型的元素。这是一个非常重要的点。vector 是用泛型实现的，`Vec` 是一个由标准库提供的类型，它可以存放任何类型，而当 `Vec` 存放某个特定类型时，那个类型位于尖括号中。

一旦插入值 Rust 就可以推断出想要存放的类型，所以你很少会需要这些类型注解。为了方便 Rust 提供了 `vec!` 宏。这个宏会根据我们提供的值来创建一个新的 `Vec`。
```rust
// 自动进行类型的推断
let x = vec![1,2,3];

// 更新值
let mut v = Vec::new();
v.push(1);
v.push(2);
```
### 所有权

类似于任何其他的 `struct`，vector 在其离开作用域时会被释放：当 `vector` 被丢弃时，所有其内容也会被丢弃，这意味着这里它包含的整数将被清理。
```rust
fn main() {
    {
        let v = vec![1, 2, 3, 4];

        // 处理变量 v

    } // <- 这里 v 离开作用域并被丢弃
}
```

### 读取vector元素

**有两种方法引用 vector 中储存的值：** 索引语法 和 者 `get` 方法。
```rust
// 索引是从0开始的
let v = vec![1, 2, 3, 4, 5];

// 使用 &和 []返回一个引用
let third: &i32 = &v[2];
println!("The third element is {}", third);


// get 方法以索引作为参数来返回一个 `Option<&T>`
match v.get(2) {
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}
```
区别：
```rust

let v = vec![1, 2, 3, 4, 5];

// 不存在的index的时候会panic
let does_not_exist = &v[100];

// 不会panic,比较优雅
let does_not_exist = v.get(100);

```
所有权验证：

**一旦程序获取了一个有效的引用，借用检查器将会执行所有权和借用规则来确保 `vector` 内容的这个引用和任何其他引用保持有效**。回忆一下不能在相同作用域中同时存在**可变和不可变引用**的规则

```rust
let mut v = vec![1, 2, 3, 4, 5];
let first = &v[0];
v.push(6); //error: mutable borrow occurs here
println!("The first element is: {}", first);
```

为什么上面案例不符合所有权的三条规则 ?

是因为在 `vector` 的结尾增加新元素时，在没有足够空间将所有所有元素依次相邻存放的情况下，可能会要求分配新内存并将老的元素拷贝到新的空间中。这时，第一个元素的引用就指向了被释放的内存。借用规则阻止程序陷入这种状况。


### 遍历

```rust
let v = vec![100, 32, 57]; 
for i in &v { 
  println!("{}", i); 
}
```

遍历可变 vector 的每一个元素的可变引用以便能改变他们。
```rust
let mut v = vec![1,2,3,4,5];
for i in &mut v{
    *i += 100;
}
println!("v is: {:?}", v);
```
为了修改可变引用所指向的值，在使用 `+=` 运算符之前必须使用**解引用运算符**（`*`）获取 `i` 中的值。

### 使用枚举类来存贮多种类型的值
前面提到 `vector` 只能储存相同类型的值。这是很不方便的；绝对会有需要储存一系列不同类型的值的用例。幸运的是，**枚举的成员都被定义为相同的枚举类型，所以当需要在 vector 中储存不同类型值时，我们可以定义并使用一个枚举！**
```rust
#[derive(Debug)]
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}


fn main(){
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Float(3.2),
        SpreadsheetCell::Text("anikin".to_string()),
    ];


    for i in &row {
        println!("i is: {:?}", i);
    }
}
```

- Rust 在编译时就必须准确的知道 vector 中类型的原因在于它需要知道储存每个元素到底需要多少内存。
- 第二个好处是可以准确的知道这个 vector 中允许什么类型。
- 如果在编写程序时不能确切无遗地知道运行时会储存进 vector 的所有类型，枚举就行不通了。相反，你可以使用 `trait` 对象。


# 字符串String

### 字符串

`String` 的类型是由标准库提供的，而没有写进核心语言部分，它是可增长的、可变的、有所有权的、UTF-8 编码的字符串类型。

String 类型的字符串拥有所有权，它在堆上分配内存，可以进行自由的修改和扩展。而 &str 类型的字符串是一个不可变的引用，通常是对字符串切片的引用，它可以指向字符串的一部分或整个字符串，但不能进行修改。

```rust
let s: &str = "Hello";
let s_string: String = s.to_string();

let s: String = String::from("Hello");
let s_ref: &str = &s;
```

字符串字面量具有`static`生命周期，即`hello_world`变量将在整个程序运行期间均有效valid,等价于下面的写法：
```rust
let hello_world: &'static str = "Hello, world!";
```


### 创建字符串
```rust
// 以 `new` 函数创建字符串
let mut s = String::new();
```
这新建了一个叫做 `s` 的空的字符串，接着我们可以向其中装载数据。通常字符串会有初始数据，因为我们希望一开始就有这个字符串。
```rust
let data = "initial contents";

// 它能用于任何实现了 `Display` trait 的类型，字符串字面值也实现了它
let s = data.to_string();

// 该方法也可直接用于字符串字面值：
let s = "initial contents".to_string();

// 上面的写法等同于
let s = String::from("initial contents");
```

记住字符串是 UTF-8 编码的，所以可以包含任何可以正确编码的数据。
```rust
let hello = String::from("السلام عليكم");
let hello = String::from("您好");
```

### 更新字符串
可以使用 `+` 运算符或 `format!` 宏来拼接 `String` 值。
```rust
// `push_str` 方法向 `String` 附加字符串 slice
// 该方法采用字符串 slice，因为我们并不需要获取参数的所有权。
let mut s1 = String::from("foo"); 
let s2 = "bar"; 
s1.push_str(s2); 
println!("s2 is {}", s2);


// 方法被定义为获取一个单独的字符作为参数
let mut s = String::from("lo");
s.push('l');



let s1 = String::from("Hello, ");
let s2 = String::from("world!");

// `s1` 在相加后不再有效的原因，和使用 `s2` 的引用的原因，
// 与使用 `+` 运算符时调用的函数签名有关。`+` 
// 运算符使用了 `add` 函数: add(self, s: &str)
// 这个语句会获取 `s1` 的所有权，附加上从 `s2` 中拷贝的内容，并返回结果的所有权。
let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用


// 复杂的字符串拼接
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");
let s = format!("{}-{}-{}", s1, s2, s3);
```

### 索引字符串

Rust 的字符串不支持索引,以下代码无法运行。
```rust
let s1 = String::from("hello");
let h = s1[0];
```
`String` 是一个 `Vec<u8>` 的封装。

为什么不支持，和Rust 是如何在内存中储存字符串的由关系。`Rust` 不允许使用索引获取 `String` 字符的原因是，**索引操作预期总是需要常数时间 (O(1))**。但是对于 `String` 不可能保证这样的性能，因为 Rust 必须从开头到索引位置遍历来确定有多少有效的字符。


### 字符串slice 

索引字符串通常是一个坏点子，因为字符串索引应该返回的类型是不明确的：**字节值、字符、字形簇或者字符串 slice。** 为了更明确索引并表明你需要一个字符串 slice，相比使用 `[]` 和单个值的索引，可以使用 `[]` 和一个 range 来创建含特定字节的字符串 slice：

```
let hello = "Здравствуйте"; 
// `s` 会是一个 `&str`，它包含字符串的头四个字节
let s = &hello[0..4];
```
如果获取 `&hello[0..1]` 会发生什么呢？答案是：`Rust` 在运行时会 `panic`，就跟访问 `vector` 中的无效索引时一样。你应该小心谨慎的使用这个操作，因为这么做可能会使你的程序崩溃。

### 遍历字符串的方法

如果你需要操作单独的 Unicode 标量值，最好的选择是使用 `chars` 方法。对 “नमस्ते” 调用 `chars` 方法会将其分开并返回六个 `char` 类型的值，接着就可以遍历其结果来访问每一个元素。
```rust
for c in "नमस्ते".chars() { 
   println!("{}", c); 
}
```

# hashMap

`HashMap<K, V>` 类型储存了一个键类型 `K` 对应一个值类型 `V` 的映射。它通过一个 **哈希函数**（*hashing function*）来实现映射，决定如何将键和值放入内存中。

哈希 map 可以用于需要任何类型作为键来寻找数据的情况，而不是像 vector 那样通过索引。

```rust
use std::collections::HashMap;
fn main(){
    // use 标准库中集合部分的 HashMap
    let mut scores = HashMap::new();

    // 存在的时候会覆盖这个值
    scores.insert(String::from("Blue"),10);
    scores.insert(String::from("Yellow"), 20);
}
```

和`vector` 一样，哈希 map 将它们的数据储存在堆上，这个 `HashMap` 的键类型是 `String` 而值类型是 `i32`。类似于 vector，哈希 map 是同质的：所有的键必须是相同类型，值也必须都是相同类型。

另一个构建哈希 map 的方法是使用一个元组的 vector 的 `collect` 方法，其中每个元组包含一个键值对。`collect` 方法可以将数据收集进一系列的集合类型，包括 `HashMap`。

```rust
let names = vec!["anikin".to_string(), "zhangsan".to_string()];
let ages = vec![20,30];

// `zip` 方法来创建一个元组的 vector，其中 “anikin” 与 20 是一对，依此类推
let data :HashMap<_, _> = names.iter().zip(ages.iter()).collect();

println!("data {:?}", data);
```
`HashMap<_, _>` 类型注解是必要的，因为可能 `collect` 很多不同的数据结构，而除非显式指定否则 Rust 无从得知你需要的类型。但是对于键和值的类型参数来说，可以使用下划线占位，而 Rust 能够根据 vector 中数据的类型推断出 `HashMap` 所包含的类型。


### hashmap的所有权

对于像 `i32` 这样的实现了 `Copy` trait 的类型，其值可以拷贝进哈希 map。对于像 `String` 这样拥有所有权的值，其值将被移动而哈希 map 会成为这些值的所有者

```rust
use std::collections::HashMap;

let field_name = String::from("Favorite color");
let field_value = String::from("Blue");

let mut map = HashMap::new();
map.insert(field_name, field_value);
// 这里 field_name 和 field_value 不再有效，
// 尝试使用它们看看会出现什么编译错误！
```
### 访问值和遍历

```rust

 let names = vec!["anikin".to_string(), "zhangsan".to_string()];
 let ages = vec![20,30];
 let data :HashMap<_, _> = names.iter().zip(ages.iter()).collect();
 println!("data {:?}", data);
    
 let key = String::from("anikin");
 // 获取某个key返回的是Otion<Some,None>
 let ani = data.get(&key);
 
 match ani {
    Some(v)=> println!("some: {}", v),
    None=> println!("None!"),
 }

println!("an value is : {:?}", ani);

// 历哈希 map 中
for (key, value) in &data  {
    println!("{}: {}", key, value);
}
```

### 键值没有对应值的时插入
检查某个特定的键是否有值，如果没有就插入一个值。为此哈希 map 有一个特有的 API，叫做 `entry`，它获取我们想要检查的键作为参数。`entry` 函数的返回值是一个枚举，`Entry`，它代表了可能存在也可能不存在的值。

`or_insert`方法在键对应的值存在时就返回这个值的 `Entry`，如果不存在则将参数作为新值插入并返回修改过的 `Entry`。

```rust
let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);


// 如果Yellow存在则yellow=10，否则插入后返回200
let yellow = scores.entry(String::from("Yellow")).or_insert(200);

println!("{:?}",scores);
```

### 根据旧值返回一个新值

另一个常见的哈希 map 的应用场景是找到一个键对应的值并根据旧的值更新它, 如下统计每个单词出现的次数。

```rust
 let text = "hello world wonderful world";
 let mut map = HashMap::new();

 for item in text.split_whitespace() {
    let count = map.entry(item).or_insert(0);
    *count += 1;
 }
 println!("==={:?}",map);
```
`or_insert` 方法事实上会返回这个键的值的一个可变引用（`&mut V`）。这里我们将这个可变引用储存在 `count` 变量中，所以为了赋值必须首先使用星号（`*`）解引用 `count`。这个可变引用在 `for` 循环的结尾离开作用域，这样所有这些改变都是安全的并符合借用规则。



# 练习题目：
### 中位数和平均数等处理

给定一系列数字，使用 vector 并返回这个列表的平均数（mean, average）、中位数（排列数组后位于中间的值）和众数（mode，出现次数最多的值；这里哈希函数会很有帮助）。
```rust
use std::collections::HashMap;

fn main(){
    let init_data = vec![10,2,5,2, 5,8, 2,3,5,100];

    let average = get_average(&init_data);
    println!("average: {}", average);


    println!("init_data: {:?}", &init_data);


    let mid = get_mid_number(&init_data);
    println!("mid: {:?}", mid);


    let max = get_max_number(&init_data);
    println!("max: {:?}", max);

    let mutil= get_mutil_number(&init_data);
    println!("mutil: {:?}", mutil);
}


// 获取平均数
fn get_average(data: &Vec<i32>) ->i32{
    let mut res = 0;
    for i in data {
        res += i
    }
    res
}

// 获取中位数 1 2 3 4 5
fn get_mid_number(data: &Vec<i32>)->Vec<i32>{
    let len = &data.len();
    let mut midata:Vec<i32> = vec![];

    if (len%2) == 0 {
        midata.push(data[ (len/2) - 1 ]);
        midata.push(data[len/2]);
    }
    else {
        midata.push( data[len/2 ]);
    }
    midata
}

// 获取最大的数据
fn get_max_number(data: &Vec<i32>)->i32{
    let mut max = 0;
    for i in data {
       if i > &max {
           max = *i;
       } 
    }
    max
}

// 获取众数
fn get_mutil_number(data: &Vec<i32>)->Vec<&i32>{
   let mut map = HashMap::new();
   let mut res = vec![];

   for item in  data {
       let counts =  map.entry(item).or_insert(0);
       *counts +=1;
   }

   let mut max_index = 0;
   for (key,value) in &map{
       if value > &max_index {
            max_index = *value;
       }
   }

   for (key,value) in map{
        if value == max_index {
            res.push(key);
        }
    }

    res
}
```

### 字符串处理
-   将字符串转换为 Pig Latin，也就是每一个单词的第一个辅音字母被移动到单词的结尾并增加 “ay”，所以 “first” 会变成 “irst-fay”。元音字母开头的单词则在结尾增加 “hay”（“apple” 会变成 “apple-hay”）。牢记 UTF-8 编码！

```rust
    let y_arr = ["a","o","e","i","u","p"]; //
     let str = String::from("Apple"); //
     let mut res = "";

     for mut i in str.split_whitespace() {
         let firstWord = &i[..1].to_lowercase();
         let exist_words =  y_arr.iter().any(|e| e == firstWord);
         let mut words = "";
         if exist_words{
            words = "-hay";
         }
         else {
            words = format!("{}",firstWord).as_str();
         }
         let sp_string = i.split_at(1).1;
         res = &(sp_string.to_owned() + &words);
         // res = format!("{}{}",sp_string.to_string(),&words.to_string());
         println!("===={}",res);
     }  

```



