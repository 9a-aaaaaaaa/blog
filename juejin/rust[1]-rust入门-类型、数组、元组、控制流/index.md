> 主要介绍入门引导示例和基本类型知识。

# 安装：
[参考官网文档](https://rust.bootcss.com/ch01-01-installation.html)

# 介绍

如果你更熟悉动态语言，如 Ruby、Python 或 JavaScript，则可能不习惯将编译和运行分为两个单独的步骤。Rust 是一种 **预编译静态类型**（*ahead-of-time compiled*）语言，这意味着你可以编译程序，并将可执行文件送给其他人，他们甚至不需要安装 Rust 就可以运行。如果你给他人一个  *.rb*、 *.py* 或  *.js* 文件，他们需要先分别安装 Ruby，Python，JavaScript 实现（运行时环境，VM）。不过在这些语言中，只需要一句命令就可以编译和运行程序。这一切都是语言设计上的权衡取舍.


Cargo 是 Rust 的构建系统和包管理器。我们把代码所需要的库叫做 **依赖**（*dependencies*）,跟随rust安装。创建一个新项目


```rust
 cargo --version
 cargo new hello_cargo
 cd hello_cargo

```

`Cargo.toml`最后一行，`[dependencies]`，是罗列项目依赖的片段的开始。**在 Rust 中，代码包被称为 *crates***。这个项目并不需要其他的 crate，不过在第二章的第一个项目会用到依赖，那时会用得上这个片段。

```rs
[package]
name = "hello_cargo"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
edition = "2018"

[dependencies]
```
cargo 的命令：

```rs
// 这个命令会创建一个可执行文件 *target/debug/hello_cargo* （在 Windows 上是 *target\debug\hello_cargo.exe*），而不是放在目前目录下。
cargo build 


// `cargo run` 在一个命令中同时编译并运行生成的可执行文件
// Cargo 发现文件并没有被改变，就直接运行了二进制文件。
// 如果修改了源文件的话，Cargo 会在运行之前重新构建项目
cargo run 

// 该命令快速检查代码确保其可以编译，但并不产生可执行文件：
// 通常 `cargo check` 要比 `cargo build` 快得多，
// 因为它省略了生成可执行文件的步骤。
// 如果你在编写代码时持续的进行检查，`cargo check` 会加速开发！
cargo check


// 发布项目
cargo build --release
```

# 猜数游戏和rust基础常识：

- `prelude`: 预导入模块，参考文档介绍

Rust comes with a variety of things in its standard library. However, if you had to manually import every single thing that you used, it would be very verbose. But importing a lot of things that a program never uses isn’t good either. A balance needs to be struck.

The *prelude* is the list of things that Rust automatically imports into every Rust program. It’s kept as small as possible, and is focused on things, particularly traits, which are used in almost every single Rust program.

- `rust`中变量默认是不可变的.

- `&` 表示这个参数是一个 **引用**（*reference*），它允许多处代码访问同一处数据，而无需在内存中多次拷贝。引用是一个复杂的特性，Rust 的一个主要优势就是安全而简单的操纵引用。完成当前程序并不需要了解如此多细节。现在，我们只需知道它像变量一样，默认是不可变的。因此，需要写成 `&mut guess` 来使其可变，而不是 `&guess`。


- `Result` 类型是 [*枚举*（*enumerations*）](https://rust.bootcss.com/ch06-00-enums.html)，通常也写作 *enums*。枚举类型持有固定集合的值，这些值被称为枚举的 **成员**（*variants*）。第六章将介绍枚举的更多细节。

`Result` 的成员是 `Ok` 和 `Err`，`Ok` 成员表示操作成功，内部包含成功时产生的值。`Err` 成员则意味着操作失败，并且包含失败的前因后果。

这些 `Result` 类型的作用是编码错误处理信息。`Result` 类型的值，像其他类型一样，拥有定义于其上的方法。


- Rust 允许用一个新值来 **隐藏** （*shadow*） `guess` 之前的值。这个功能常用在需要转换值类型之类的场景。它允许我们复用 `guess` 变量的名字，而不是被迫创建两个不同变量，诸如 `guess_str` 和 `guess` 之类。


```rust
use std::io;

// Rng 是一个 trait，它定义了随机数生成器应实现的方法，想使用这些方法的话，此 trait 必须在作用域中
use rand::Rng;


// 同 Result 一样， Ordering 也是一个枚举，不过它的成员是 Less、Greater 和 Equal。
// 这是比较两个值时可能出现的三种结果。
use std::cmp::Ordering;


fn main() {

    loop {

        println!("guess the number!!");

        let secret_number = rand::thread_rng().gen_range(1..101);
        println!("The secret number is: {}", secret_number);



        //  :: 语法表明 new 是 String 类型的一个 关联函数（associated function）。
        //  关联函数是针对类型实现的，在这个例子中是 String，而不是 String 的某个特定实例。
        // 一些语言中把它称为 静态方法（static method）。
        // new 函数创建了一个新的空字符串，你会发现很多类型上有 new 函数，因为它是创建类型实例的惯用函数名。
        let mut guess = String::new();


        // stdin 函数返回一个 std::io::Stdin 的实例，这代表终端标准输入句柄的类型。
        // 调用 read_line 方法从标准输入句柄获取用户输入
        // 无论用户在标准输入中键入什么内容，都将其存入一个可变字符串中，因此它需要字符串作为参数
        io::stdin().read_line(&mut guess).expect("Faild to read line");
        println!("you guessed: {}", guess);



        // 必须把从输入中读取到的 String 转换为一个真正的数字类型
        // 按下 enter 键时，会在字符串中增加一个换行（newline）符。trim消除
        // 字符串的 parse 方法 将字符串解析成数字。
        // parse可以解析多种数字类型，因此需要告诉 Rust 具体的数字类型，这里通过 let guess: u32 指定
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };


        // cmp 方法用来比较两个值并可以在任何可比较的值上调用。
        // 它获取一个被比较值的引用：这里是把 guess 与 secret_number 做比较。 
        // 然后它会返回一个刚才通过 use 引入作用域的 Ordering 枚举的成员。
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            },
        }
    }
}

```

# 基础知识和类型

### 1：常量：常量可以在任何作用域中声明，包括全局作用域，不能是函数的运行结果。

```rs
const MAX_POINTS: u32 = 100_000;
```

### 2：`shadowing`
```rs
fn main() {
    let x = 5;
    let x = x + 1;
    let x = x * 2;
    println!("The value of x is: {}", x); // 12
    
    let spaces = "   ";
    let spaces = spaces.len();
}
```
这里允许第一个 `spaces` 变量是字符串类型，而第二个 `spaces` 变量，它是一个恰巧与第一个变量同名的崭新变量，是数字类型。隐藏使我们不必使用不同的名字，如 `spaces_str` 和 `spaces_num`；相反，我们可以复用 `spaces` 这个更简单的名字。然而，如果尝试使用 `mut`，将会得到一个编译时错误。


### 3： 数据类型：**标量（scalar）** 和 **复合（compound）**

Rust 是 **静态类型**（*statically typed*）语言，也就是说在编译时就必须知道所有变量的类型。

根据值及其使用方式，编译器通常可以推断出我们想要用的类型。当多种类型均有可能时，必须增加类型注解。

```rs
#![allow(unused_variables)]
fn main() {
  let guess: u32 = "42".parse().expect("Not a number!");
}
```

#### a:标量类型

**标量**（*scalar*）类型代表一个单独的值。Rust 有四种基本的标量类型：`整型`、`浮点型`、`布尔类型`和`字符类型`。

一个数字，可以采用不同的进制表示，如十进制，十六进制，八进制和是二进制等。区分这些不同进制的数的方式是根据字面值所带的前缀，如下表：

| 数字字面量      | 示例       |
| ------------- | ------------- |
| 十进制           | `98_222`      |
| 十六进制          | `0xff`        |
| 八进制           | `0o77`        |
| 二进制           | `0b1111_0000` |
| 字节 (仅限于 `u8`) | `b'A'`        |

其中字节比较特殊： 

```rust
// 字节 (仅限于 u8)	返回的是ASCII 码字节字面值
let byte = b'A';  

// 字节字符串字面值; 构造一个 [u8] 类型而非字符串
let bytes = b"AA";  // [65, 65]

// 字符串切片值进行转换为字节值
let str_byte = "AAA".as_bytes();

```

1: **整数** 是一个没有小数部分的数字。`u32`:占据 32 比特位的无符号整数（有符号整数类型以 `i` 开头而不是 `u`）。**有符号** 和 **无符号** 代表数字能否为负值，

在Rust中，整型数据表示的是数值。根据长度不同，从一个字节到十六个字节，同时每种长度又分为有符号类型和无符号类型，如下表：

| 长度（字节） |  有符号  |  无符号|
| :----: | :---: | :---: |
|    1   |   i8  |   u8  |
|    2   |  i16  |  u16  |
|    4   |  i32  |  u32  |
|    8   |  i64  |  u64  |
|   16   |  i128 | u8128 |
|   随系统  | isize | usize |


1. i8 和 u8的表示范围：
-   `int8` 表示`-128`到`127`之间的整数值。
-   `uint8` 表示`0`到`255`之间的整数值。

2. i16和u16的表示范围：
-   `int16` 表示`-32768`和`32767`之间的整数值。
-   `uint16` 表示`0`和`65535`之间的整数值。

3. i32和u32的表示范围：
-   `int32` 表示`-2147483648`到`2147483647`之间的整数值。
-   `uint32` 表示`0`和`4294967295`之间的整数值。

4. i64和u64的表示范围：
-   `int64` 表示`-9223372036854775808`和`9223372036854775807`之间的整数值。
-   `uint64`表示`0`和`18446744073709551615`之间的整数值。

另外，`isize` 和 `usize` 类型依赖运行程序的计算机架构：64 位架构上它们是 64 位的， 32 位架构上它们是 32 位的。

那么该使用哪种类型的数字呢？如果拿不定主意，Rust 的默认类型通常就很好，数字类型默认是 `i32`：它通常是最快的，甚至在 64 位系统上也是。`isize` 或 `usize` 主要作为某些集合的索引。



2：浮点数

Rust 也有两个原生的 **浮点数**（*floating-point numbers*）类型，它们是带小数点的数字。Rust 的浮点数类型是 `f32` 和 `f64`，分别占 32 位和 64 位。默认类型是 `f64`，因为在现代 CPU 中，它与 `f32` 速度几乎一样，不过精度更高。

```rs
    let x = 2.0; // f64
    let y: f32 = 3.0; // f32
```

3: 布尔：

```rs
    let t = true;
    let f: bool = false; // 显式指定类型注解
```

4: 字符类型

目前为止只使用到了数字，不过 Rust 也支持字母。Rust 的 `char` 类型是语言中最原生的字母类型，如下代码展示了如何使用它。（注意 `char` 由单引号指定，不同于字符串使用双引号。）

```rs
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '😻';
}
```
Rust 的 `char` 类型的大小为四个字节(four bytes)，并代表了一个 Unicode 标量值（Unicode Scalar Value），这意味着它可以比 ASCII 表示更多内容。在 Rust 中，拼音字母（Accented letters），中文、日文、韩文等字符，emoji（绘文字）以及零长度的空白字符都是有效的 `char` 值。Unicode 标量值包含从 `U+0000` 到 `U+D7FF` 和 `U+E000` 到 `U+10FFFF` 在内的值。


#### b: 符合类型

**复合类型**（*Compound types*）可以将多个值组合成一个类型。Rust 有两个原生的复合类型：`元组（tuple）`和`数组（array）`。

#### b.1： 元组类项

**元组是一个将多个其他类型的值组合进一个复合类型的主要方式**。**元组长度固定：一旦声明，其长度不会增大或缩小。**

我们使用包含在圆括号中的逗号分隔的值列表来创建一个元组。元组中的每一个位置都有一个类型，而且这些不同值的类型也不必是相同的。

`tup` 变量绑定到整个元组上，因为元组是一个单独的复合元素。为了从元组中获取单个值，可以使用`模式匹配（pattern matching`）来解构（destructure）元组值。

除了使用模式匹配解构外，也可以使用点号（`.`）后跟值的索引来直接访问它们。


```rs
let tup: (i32, f64, u8) = (500, 6.4, 1);

// 解构
let (x, y, z) = tup; 
println!("The value of y is: {}", y);

// 直接获取
let five_hundred = tup.0;
let flot_num = tup.1;

```


#### b.2: 数组类型

**与元组不同，数组中的每个元素的类型必须相同**。Rust 中的数组与一些其他语言中的数组不同，因为 **Rust 中的数组是固定长度的：一旦声明，它们的长度不能增长或缩小**。

在`栈（stack）`存贮，总是有固定数量的元素。

```rs
let arr = [1,2,3,3];

```
**当你想要在栈（stack）而不是在堆（heap）上为数据分配空间**，**或者是想要确保总是有固定数量的元素时，数组非常有用**。

但是数组并不如 `vector` 类型灵活。`vector` 类型是标准库提供的一个 **允许** 增长和缩小长度的类似数组的集合类型。当不确定是应该使用数组还是 `vector` 的时候，你可能应该使用 `vector`。


一个你可能想要使用数组而不是 vector 的例子是，当程序需要知道一年中月份的名字时。程序不大可能会去增加或减少月份。这时你可以使用数组，因为我们知道它总是包含 12 个元素：

```
let months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
              
              
// 编写类型数组
// `i32` 是每个元素的类型。分号之后，数字 `5` 表明该数组包含五个元素。
let arr: [i32; 5] = [1, 2, 3, 4, 5];


// 访问数组元素
let ione = months[1];

// 下标索引超过数组本身的长度的时候，编译不报错，但是运行的时候会产生错误。


// 数组循环
let mut arr = [1,2,3,4,5];
    arr[1] = 100;
    for val in arr.iter(){
        println!("{}",val);
    }

```

### c: 类型转换
当涉及到数字类型时，Rust 要求明确。一个人不能想当然地把“u8”用在“u32”上而不出错。幸运的是，使用 **as** 关键字，Rust 使数字类型转换非常容易。
```rust
    let a = 13u8;
    let b = 7u32;
    let c = a as u32 + b;
    println!("{}", c); // 20

    let t = true;
    println!("{}", t as u8);  // 1

```


关于类型的总结: 
-   布尔型 - `bool` 表示 true 或 false
-   无符号整型- `u8` `u32` `u64` `u128` 表示正整数
-   有符号整型 - `i8` `i32` `i64` `i128` 表示正负整数
-   指针大小的整数 - `usize` `isize` 表示内存中内容的索引和大小
-   浮点数 - `f32` `f64`
-   元组（tuple） - `(value, value, ...)` 用于在栈上传递固定序列的值
-   数组 - 在编译时已知的具有固定长度的相同元素的集合
-   切片（slice） - 在运行时已知长度的相同元素的集合
-   `str`(string slice) - 在运行时已知长度的文本
另外，你也可以通过将类型附加到数字的末尾来明确指定数字类型（如 `13u32` 和 `2u8`）


### 4： 函数

**函数参数是特殊变量，是函数签名的一部分**。当函数拥有参数（形参）时，可以为这些参数提供具体的值（实参）。

在函数签名中，**必须** 声明每个参数的类型。这是 Rust 设计中一个经过慎重考虑的决定：要求在函数定义中提供类型注解，意味着编译器不需要你在代码的其他地方注明类型来指出你的意图。

```rs
fn main() {
    another_function(5);
}

fn another_function(x: i32) {
    println!("The value of x is: {}", x);
}
```

**因为 Rust 是一门基于表达式（expression-based）的语言**，这是一个需要理解的（不同于其他语言）重要区别。

**语句**（*Statements*）是执行一些操作但不返回值的指令。表达式（*Expressions*）计算并产生一个值。

```rs
fn add() -> i32{
    let x = 5;
    let y = {
        let x = 10;
        x+1
    };
    x+y
}
```

### 5: 控制流

注意，和`js`等不同的时， `if`代码中的条件 **必须** 是 `bool` 值。如果条件不是 `bool` 值，我们将得到一个错误
```rs
fn main() {
    let number = 3;
    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
}

```


**在let 中使用if语句**

代码块的值是其最后一个表达式的值，而数字本身就是一个表达式。`if`和`eles`的类型也必须相同。
```rs
fn main(){
    let iscondition = true;
    let number = if iscondition {
        10
    }else {
        0
    };
    println!(">>> {} ", number);
}
```


### 6: 循环重复

多次执行同一段代码是很常用的，Rust 为此提供了多种 **循环**（*loops*）。一个循环执行循环体中的代码直到结尾并紧接着回到开头继续执行。为了实验一下循环，让我们新建一个叫做 *loops* 的项目。

Rust 有三种循环：`loop`、`while` 和 `for`。我们每一个都试试。

```rs
fn main() {
    loop {
        println!("again!");
    }
}
```

反复打印 `again!`，直到我们ctrl-c，来终止一个陷入无限循环的程序。`Rust` 提供了另一种更可靠的退出循环的方式。可以使用 `break` 关键字来告诉程序何时停止循环。

从循环返回值：

```rs
fn main() {
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2; // 这个loop的返回值
        }
    };
    println!("The result is {}", result);
}

```

**while**：
```rs
fn main() {
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;
    while index < 5 {
        println!("the value is: {}", a[index]);
        index = index + 1;
    }
}
```
**for**:

- `..` 运算符创建一个可以生成包含起始数字、但不包含末尾数字的数字序列的迭代器。
- `..=` 运算符创建一个可以生成包含起始数字、且包含末尾数字的数字序列的迭代器。

```rs
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a.iter() {
        println!("the value is: {}", element);
    }
    
    
    for x in 0..5 {
        println!("{}", x); // 0,1,2,3,4
    }

    for x in 0..=5 {
        println!("{}", x);// 0,1,2,3,4,5
    }
}

```
### 7: 匹配

类似switch 语句吗

```rust
fn main() {

    // match std::io::stdin().read_line(&mut guess){
    //     Ok(n)=>{
    //         println!("byte read is {}", n);
    //         println!("You guessed: {}", guess);
    //     },
    //     Err(e)=>{
    //         println!("You failed: {}", e);
    //     }
    // };
    
    let mut guess = String::new();
    stdin().read_line(&mut guess).expect("Failed to read line");
    let x: u32 = guess.trim().parse().unwrap();

    match x {
        0 => {
            println!("found zero");
        }
        // 我们可以匹配多个值
        1 | 2 => {
            println!("found 1 or 2!");
        }
        // 我们可以匹配迭代器
        3..=9 => {
            println!("found a number 3 to 9 inclusively");
        }
        // 我们可以将匹配数值绑定到变量
        matched_num @ 10..=100 => {
            println!("found {} number between 10 to 100!", matched_num);
        }
        // 这是默认匹配，如果没有处理所有情况，则必须存在该匹配
        _ => {
            println!("found something else!");
        }
    }
}

```

### 控制流程中的语句
`if`，`match`，函数，以及作用域块都有一种返回值的独特方式。
```rs
    // rust 中的三目运算
    let num = 10;
    let res = if num <20 {"low"} else {"upper"};
    println!("res is {}", res);

    // match 返回值
    let food = "hanyangs";
    let food_type = match food {
        "hanyang"  => "is hanyang",
        _ => "not what i want",
    };
    println!("your food type is {}", food_type);

    // 块作用域返回值
    let v = {
        let a = 100;
        let b = 200;
        a + b
    };
    println!("v is {}", v+10);
```       