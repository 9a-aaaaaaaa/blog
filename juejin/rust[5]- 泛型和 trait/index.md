# 泛型

**提高代码复用能力，处理重复代码的问题。**

- 是具体类型或者其他属性的抽象代替。
- 编写的代码不是最终的代码，而是一种模板，里面有一些**占位符** 。
- 编译器在编译时将占位符替换为具体的类型。

引入案例：求出`slice` 中最大值功能的函数。
```rust
// 整数型
let data = vec![12,33,14,100,99,76,24];
let res = max_number_find(&data);
println!("max is : {}", res);

// 字符型
let char_list = vec!['d','e','a','b','c',];
let char_max = max_char_find(&char_list);
println!("char_max:{}", char_max);

// 数值类型
fn max_number_find(data: &[i32])->i32{
    let mut max = data[0];
    for &i in data{
        if i > max {
            max = i;
        }
    }
    max
}

// 字符类型
fn max_char_find(data: &[char])->char{
    let mut max = data[0];
    for &i in data{
        if i > max {
            max = i;
        }
    }
    max
}
```
使用泛型约束：
```rust
fn max_T_find<T:PartialOrd + Copy>(data: &[T])->T{
    // 这个操作需要类型具有Copy语义。因此加上对类型的Copy语义要求
    let mut max = data[0];
    for &i in data{
    
    // 这个运算符需要 PartialOrd，这个的意思是你用比较符号，得能比较的数据类型
        if i > max {
            max = i;
        }
    }
    max
}
```
`std::cmp::PartialOrd`，这是一个 *trait*。简单来说，`max_T_find` 的函数体不能适用于 `T` 的所有可能的类型。因为在函数体需要比较 `T` 类型的值，不过它只能用于我们知道如何排序的类型。为了开启比较功能，标准库中定义的 `std::cmp::PartialOrd` trait 可以实现类型的比较功能。


### 函数中使用泛型
使用泛型定义函数时，**在函数签名中通常为参数和返回值指定数据类型的位置放置泛型**。

**当需要在函数体中使用一个参数时，必须在函数签名中声明这个参数以便编译器能知道函数体中这个名称的意义。** 同理，当在函数签名中使用一个类型参数时，必须在使用它之前就声明它。


```rust
fn main(){
    let x1 = vec![1,2,3,4];
    let c1 = change_to_reverse(&x1);


    let x2 = vec!['a','b','c','d','e'];
    let c2 = change_to_reverse(&x2);


    println!("c1:{:?}",c1);
    println!("c2:{:?}",c2);
}


// 实现slice 的reverse功能
fn change_to_reverse<T>(list:&[T])->Vec<&T>{
    let mut temp_v = vec![];
    let mut i = list.len();
    while i>0 {
        i=i-1;
        let current = &list[i];
        temp_v.push(current);
    }
    temp_v
}
```


### 结构体中的泛型

```rust

// `Point` 的定义为拥有两个泛型类型 `T` 和 `U`
struct Point<T,U> {
    x: T, // x是T类型
    y: U
}

// impl 后面必须声明 T，这样就可以在 Point<T> 上实现的方法中使用它了
// 在 impl 之后声明泛型 T ，这样 Rust 就知道 Point 的尖括号中的类型是泛型而不是具体类型。
impl<T,U> Point<T,U> {

    // 返回T类型x字段的引用
    fn getx(&self) -> &T {
        &self.x
    }
}
```

`Point<T>` 的定义中只使用了一个泛型类型，这个定义表明结构体 `Point<T>` 中的 `T` 是泛型的，而且字段 `x` 和 `y` **都是** 相同类型的，无论它具体是何类型。

创建一个有不同类型值的 `Point<T>` 的实例：

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10.4 };
    let p2 = Point { x: "Hello", y: 'c'};

    let p3 = p1.mixup(p2);

    println!("p3.x = {}, p3.y = {}", p3.x, p3.y);
}
```
在方法中使同样使用泛型：`mixup` 将一个 `Point<T, U>` 点的 `x `与 `Point<V, W>` 点的 `y `融合成一个类型为 `Point<T, W>` 的新点。

### 枚举中的泛型
```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T,E> {
    Ok(T),
    Err(E),
}
```

### 泛型的性能
Rust 通过在编译时进行泛型代码的 **单态化**（*monomorphization*）来保证效率。**单态化**是一个通过填充编译时使用的具体类型，将通用代码转换为特定代码的过程。

我们可以使用泛型来编写不重复的代码，而 Rust 将会为每一个实例编译其特定类型的代码。这意味着在使用泛型时没有运行时开销；当代码运行，它的执行效率就跟好像手写每个具体定义的重复代码一样。这个单态化过程正是 Rust 泛型在运行时极其高效的原因。




# trait

`trait` 类似于接口，**特性与接口相同的地方在于它们都是一种行为规范，可以用于标识哪些类有哪些方法。** 可以使用 *trait bounds* 指定泛型是任何拥有特定行为的类型。

> 注意：*trait* 类似于其他语言中的常被称为 **接口**（*interfaces*）的功能，虽然有一些不同。

### 定义trait 


一个类型的行为由其可供调用的方法构成。如果可以对不同类型调用相同的方法的话，这些类型就可以共享相同的行为了。`trait` 定义是一种将方法签名组合起来的方法，目的是定义一个实现某些目的所必需的行为的集合。


引入案例：`lib.rs`

```rust
// 定义一个trait
// trait 体中可以有多个方法：一行一个方法签名且都以分号结尾。
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

// 为NewsArticle类型实现trait 
impl Summary for  NewsArticle{
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

// 为Tweet类型实现trait 
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```
再`main.rs`中调用:
```rust
use weibo::NewsArticle;
use weibo::Tweet;
use weibo::Summary;

fn main(){
    let news_artic =  NewsArticle {
        headline: "USA is great country!".to_string(),
        author: "anikin".to_string(),
        content: "this is a arcticle!".to_string(),
        location: "BeiJing".to_string(),
    };

    let tweet = Tweet {
        username: String::from("anikin"),
        content:String::from("my tweet content not good!"),
        reply: false,
        retweet: false,
    };

    let s1 = news_artic.summarize();
    let t1 = tweet.summarize();

    println!("s1: {}",s1);
    println!("t1: {}",t1);
}
```


如下使用方式：

``` rust
// 规定了实现者必须有这个方法
trait Descriptive {
    fn describe(&self) -> String;
}

struct Person {
    name: String,
    age: u8,
}


// Person实现这个trait
impl Descriptive for Person {
    fn describe(&self) -> String {
        format!("{} {}", self.name, self.age)
    }
}


fn main(){
    let p1 = Person{
        name: String::from("anikin"),
        age: 23
    };

    println!(">>{}", p1.describe()) ; // anikin 23
}
```

实现 `trait` 时需要注意的一个限制是，只有当 `trait` 或者要实现 `trait` 的类型位于 `crate` 的本地作用域时，才能为该类型实现 trait。

但是不能为外部类型实现外部 trait。

这个限制是被称为 **相干性**（*coherence*） 的程序属性的一部分，或者更具体的说是 **孤儿规则**（*orphan rule*），其得名于不存在父类型。这条规则确保了其他人编写的代码不会破坏你代码，反之亦然。没有这条规则的话，两个 crate 可以分别对相同类型实现相同的 trait，而 Rust 将无从得知应该使用哪一个实现。

### 默认trait

这是`特性(trait)`与接口的不同点：**接口只能规范方法而不能定义方法，但特性可以定义方法作为默认方法**，因为是"默认"，所以对象既可以重新定义方法，也可以不重新定义方法使用默认的方法：


``` rust
use std::fmt::Display;

pub trait People {
    fn get_age(&self) -> &[u8];
}

pub trait DefaultPeople {
    fn get_name(&self)->String{
        String::from("this is jock")
    }
}

struct Animal<'a> {
    name: &'a str,
    age: u8,
}

impl People for Animal<'_> {
    fn get_age(&self) ->&[u8] {
        self.name.as_bytes()
    }
}
// 指定一个空的imply块，使用指定的默认的trait方法
impl DefaultPeople for Animal<'_> {}
impl Display for Animal<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "age is ({})", self.age)
    }
}


fn main(){
   
    let get_a_instance = Animal{
        name: "cat",
        age: 18,
    };

    println!("get_a_instance is {:?}", get_a_instance.get_age());
    println!("get name is {:?}", get_a_instance.get_name());

    let upper = change_name_first_char(&get_a_instance);
    println!("upper name is {}", upper);

    let tb = change_name_first_trait_bounds(&get_a_instance);
    println!("trait bounds is {:?}", tb);


}

fn change_name_first_char(str: &impl DefaultPeople)->String{
    str.get_name().to_uppercase()
}

// trait bounds 实现
// fn change_name_first_trait_bounds<T: DefaultPeople+Display>(str: &T)->String{
fn change_name_first_trait_bounds<T>(str: &T)->String
where T: DefaultPeople+Display
{
    let mut origin = str.get_name().to_uppercase();
    origin.push_str("$:");

    // 打印一下
    let fmt_str = format!("{}", str);

    format!("{}{}", fmt_str,origin)
}
```

### trait 当做参数 `impl Trait`

`impl Trait`: 很多情况下我们需要传递一个函数做参数，例如`回调函数`、`设置按钮事件`等。js中的回调函数，在 `Rust` 中可以通过传递特性参数来实现。
例如上面案例中`lib.rs`中新增：
```rust
pub fn notify(item: impl Summary){
    println!("echo data: {}", item.summarize());
}

// main.rs中直接可以调用：
use weibo:: *;
notify(news_artic);
```

例如：
```rust

trait Descriptive {
    fn describe(&self) -> String {
        String::from("[Object]")
    }
}

struct Person {
    name: String,
    age: u8
}

impl Descriptive for Person {
    fn describe(&self) -> String {
        format!("{} {}", self.name, self.age)
    }
}

fn main() {
    let cali = Person {
        name: String::from("Cali"),
        age: 24
    };
    println!("{}", cali.describe());
    notify(cali);
}


// trait 当做参数，
fn notify(item: impl Descriptive) {
    println!(">>> notify {}", item.describe());
}
```
`notify`任何实现了 `Descriptive` 特性的对象都可以作为这个函数的参数，这个函数没必要了解传入对象有没有其他属性或方法，只需要了解它一定有 `Descriptive `特性规范的方法就可以了。


### 特征约束 trait bound

`impl Trait` 语法适用于直观的例子，它不过是一个较长形式的语法糖。这被称为 *trait bound*，这看起来像：
```rust
pub fn notify<T: Summary>(item: T) {
    println!("Breaking news! {}", item.summarize());
}
```

`impl Trait` 很方便，适用于短小的例子。真正的完整书写形式如上所述，形如 `T: Summary` 被称为**特征约束**。

trait bound 则适用于更复杂的场景。例如，可以获取两个实现了 `Summary` 的参数。使用 `impl Trait` 的语法看起来像这样：
```rust
pub fn notify(item1: impl Summary, item2: impl Summary) {
```
不过如果你希望强制它们都是相同类型呢？这只有在使用 trait bound 时才有可能：
```rust
pub fn notify<T: Summary>(item1: T, item2: T) {
```

假设使用`trait bound` 实现：
```rust
fn notify<T: Descriptive>(item1:T,item2:T) {
    println!("Breaking news!->1: {}", item1.describe());
    println!("Breaking news!->2: {}", item2.describe());
}
```
泛型 `T` 被指定为 `item1` 和 `item2` 的参数限制，如此传递给参数 `item1` 和 `item2` 值的具体类型必须一致。更加的简单和直观。


### 使用+号实现多个

```rust

// impl Trait 的形式
pub fn notify(item: impl Summary + Display) {}


// trait bound 的形式
pub fn notify<T: Summary + Display>(item: T) {}

```

### where 简化trait bound参数

```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: T, u: U) -> i32 {}
```

简化后的写法：

```rust
fn some_function<T, U>(t: T, u: U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}
```

### tait 的特性作为返回值

```rust
fn new_persion()->impl Descriptive {
    Person {
        name: String::from("zhaobenshan"),
        age: 22
    }
}
```

特性做返回值**只接受实现了该特性的对象做返回值且在同一个函数中所有可能的返回值类型必须完全一样**。 也就是说这**只适用于返回单一类型的情况**。

返回一个只是指定了需要实现的 `trait` 的类型的能力在闭包和迭代器场景十分的有用。

比如结构体 A 与结构体 B 都实现了特性 Trait，下面这个函数就是错误的：因为脱离的单一性原则。

```rust
fn some_function(bool bl) -> impl Descriptive {
    if bl {
        return A {};
    } else {
        return B {};
    }
}
```