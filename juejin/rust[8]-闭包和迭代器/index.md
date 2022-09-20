Rust 的设计灵感来源于很多现存的语言和技术。其中一个显著的影响就是 **函数式编程**（*functional programming*）。函数式编程风格通常包含将函数作为参数值或其他函数的返回值、将函数赋值给变量以供之后执行等等。

本篇主要展示 Rust 的一些在功能上与其他被认为是函数式语言类似的特性。更具体的，我们将要涉及：

-   **闭包**（*Closures*），一个可以储存在变量里的类似函数的结构
-   **迭代器**（*Iterators*），一种处理元素序列的方式
-   如何使用这些功能来改进第十二章的 I/O 项目。
-   这两个功能的性能。（**剧透警告：**  他们的速度超乎你的想象！）


# 1：闭包 Closure

**闭包：可以捕获其所在环境得匿名函数**。（ps: 学过js得话这个概念基本是一样的）。

- 是匿名函数
- 保存为变量、作为参数
- 可在一个地方创建闭包，然后再另外一个上下文中调用闭包来完成运算。
- 可从其定义的作用域捕获值

```rust
use std::{time::Duration, thread};
fn main() {
    let num = 100;
    let expensive_closure = |num| {
        thread::sleep(Duration::from_secs(3));
        num
    };
    println!("expensive_closure={:?}",expensive_closure(num));
}
```

闭包的定义以一对竖线（`|`）开始，在竖线中指定闭包的参数。这个闭包有一个参数 `num`；如果有多于一个参数，可以使用逗号分隔，比如 `|param1, param2|`。

```rust
let example_closure = |x| x;
```

参数之后是存放闭包体的大括号 —— 如果闭包体只有一行则大括号是可以省略的。大括号之后闭包的结尾，需要用于 `let` 语句的分号。因为闭包体的最后一行没有分号（正如函数体一样），所以闭包体（`num`）最后一行的返回值作为调用闭包时的返回值 。


### 1：闭包的类型推断
- 闭包不要求标注参数和返回值类型
- 闭包通常很短小，只在狭小的上下文中工作，编译器通常能推断出类型
- 可以手动添加类型标注

```rust
use std::thread;
use std::time::Duration;

let expensive_closure = |num: u32| -> u32 {
    println!("calculating slowly...");
    thread::sleep(Duration::from_secs(2));
    num
};
```

**闭包定义会为每个参数和返回值推断一个具体类型**。

```rust
 let example_closure = |x| x;
 let s = example_closure(String::from("anikin"));
// 上面已经使用过闭包，类型被唯一确定。因此闭包被推断为字符串类型的声明。
// 只能推断为唯一的类型，不在被再次推断
// let n = example_closure(6); // 报错
println!("{}", s);
```

### 2：使用带有泛型和Fn trait的闭包

创建一个struct，它持有闭包及其调用结果。
- 该结构体只会在需要结果时执行闭包，并会缓存结果值，这样余下的代码就不必再负责保存结果并可以复用该值
- 可缓存结果
这个模式通常叫做**记忆化(memoization)或延迟计算(lazy evaluation)**


**如何让struct持有闭包**

- struct 的定义需要知道所有字段的类型，因此需要指明闭包的类型
- 每个闭包实例都有自己唯一的匿名类型，即使两个闭包签名完全一样。
- 所以需要使用：**泛型和Trait Bound**



**Fn Trait**

- `Fn Trait` 由标准库提供
- 所有的闭包都至少实现了以下trait之一
   - Fn
   - FnMut
   - FnOnce

如下展示一个存放了闭包和一个 Option 结果值的 `Cacher` 结构体的定义

```rust
struct Cacher<T>
    where T: Fn(u32) -> u32
{
    calculation: T,
    value: Option<u32>,
}

impl<T> Cacher<T>
    where T: Fn(u32) -> u32
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: None,
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value {
            Some(v) => v,
            None => {
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            },
        }
    }
}
```

### 3: `Cacher` 实现的限制


```rust
#[test]
fn call_with_different_values() {
    let mut c = Cacher::new(|a| a);

    let v1 = c.value(1);
    let v2 = c.value(2);

    assert_eq!(v2, 2);
}
```

使用为 1 的 `arg` 和为 2 的 `arg`调用 `Cacher` 实例的 `value` 方法，同时我们期望使用为 2 的 `arg` 调用 `value` 会返回 2。但是时失败的。


`Cacher` 实例假定正对不同的参数`arg`,`value`方法总会得到相同的值。可以使用`HashMap`代替单个的值：
  - `key:arg`参数
  - `value`: 执行闭包的结果
  

### 4：闭包捕获其环境

- 闭包可以访问定义它的作用域内的变量，而普通函数则不行。
- 会产生内存开销。
```rust
fn main() {
    let x = 4;
    let equal_to_x = |z| z == x;
    let y = 4;
    assert!(equal_to_x(y));
}
```
但是普通函数则不行。
```rust
fn main() {
    let x = 4;
    fn equal_to_x(z: i32) -> bool { z == x }
    let y = 4;
    assert!(equal_to_x(y));
}
```

闭包从所在环境捕获值得方式：
与函数获得参数得三种方式一样：
- 获得所有权：`FnOnce`
- 可变借用：`FnMut`
- 不可变借用：`Fn`

创建闭包时，通过闭包对环境值得使用，`Rust`推断出具体得使用那个`Trait`。
- 所有的闭包都实现了`FnOnce`
- 没有移动捕获变量的实现了`FnMut`
- 无需可变访问捕获变量的闭包实现了`Fn`

`move` 关键字
再参数列表前使用`move`，可以强制闭包取得它所使用的环境值得所有权，
 - 当将闭包传递给新线程以移动数据使其归新线程所有时，此技术最为有用。
```rust
fn main() {
    let x = vec![1, 2, 3];
    let equal_to_x = move |z| z == x;
    println!("can't use x here: {:?}", x);
    let y = vec![1, 2, 3];
    assert!(equal_to_x(y));
}
```
`x` 被移动进了闭包，因为闭包使用 `move` 关键字定义。接着闭包获取了 `x` 的所有权，同时 `main` 就不再允许在 `println!` 语句中使用 `x` 了。去掉 `println!` 即可修复问题。

大部分需要指定一个 `Fn` 系列 trait bound 的时候，可以从 `Fn` 开始，而编译器会根据闭包体中的情况告诉你是否需要 `FnMut` 或 `FnOnce`。


# 2： 迭代器
**迭代器**（*iterator*）负责遍历序列中的每一项和决定序列何时结束的逻辑。当使用迭代器时，我们无需重新实现这些逻辑。

迭代器是 **惰性的**（*lazy*），这意味着在调用方法使用迭代器之前它都不会有效果。
```rust
let v1 = vec![1, 2, 3]; 
let v1_iter = v1.iter(); // 创建了一个迭代器

for val in v1_iter { 
 println!("Got: {}", val); 
}
```

### 1： iterator trait 和 next方法

迭代器都实现了一个叫做 `Iterator` 的定义于标准库的 trait。这个 trait 的定义看起来像这样：

```rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
    // 此处省略了方法的默认实现
}
```
新语法：`type Item` 和 `Self::Item`，他们定义了 trait 的 **关联类型**（*associated type*
只需知道这段代码表明实现 `Iterator`trait 要求同时定义一个 `Item` 类型，这个 `Item` 类型被用作 `next` 方法的返回值类型。换句话说，`Item`类型将是迭代器返回元素的类型。

`next` 是 `Iterator` 实现者被要求定义的唯一方法。`next` 一次返回迭代器中的一个项，封装在 `Some`中，当迭代器结束时，它返回 `None`。


```rust
#[test]
fn iterator_demonstration() {
    let v1 = vec![1, 2, 3];
    let mut v1_iter = v1.iter();
    assert_eq!(v1_iter.next(), Some(&1));
    assert_eq!(v1_iter.next(), Some(&2));
    assert_eq!(v1_iter.next(), Some(&3));
    assert_eq!(v1_iter.next(), None);
}
```

### 2: 消费迭代器的方法

这些调用 `next` 方法的方法被称为 **消费适配器**（*consuming adaptors*），因为调用他们会消耗迭代器

#### 1： sum 

调用 `sum` 方法获取迭代器所有项的总和。调用 `sum` 之后不再允许使用 `v1_iter` 因为调用 `sum` 时它会获取迭代器的所有权。

```rust
#[test]
fn iterator_sum() {
    let v1 = vec![1, 2, 3];
    let v1_iter = v1.iter();
    let total: i32 = v1_iter.sum();
    assert_eq!(total, 6);
}
```

#### 2： map
```rust
let v1: Vec<i32> = vec![1, 2, 3];
let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
assert_eq!(v2, vec![2, 3, 4]);

```
调用 `map` 方法创建一个新迭代器，接着调用 `collect` 方法消费新迭代器并创建一个 `vector`。


#### 3： filter 

迭代器的 `filter` 方法获取一个使用迭代器的每一个项并返回布尔值的闭包。如果闭包返回 `true`，其值将会包含在 `filter` 提供的新迭代器中。如果闭包返回 `false`，其值不会包含在结果迭代器中。

```rust

#![allow(unused_variables)]
fn main() {
#[derive(PartialEq, Debug)]
struct Shoe {
    size: u32,
    style: String,
}

fn shoes_in_my_size(shoes: Vec<Shoe>, shoe_size: u32) -> Vec<Shoe> {
    shoes.into_iter()
        .filter(|s| s.size == shoe_size)
        .collect()
}

#[test]
fn filters_by_size() {
    let shoes = vec![
        Shoe { size: 10, style: String::from("sneaker") },
        Shoe { size: 13, style: String::from("sandal") },
        Shoe { size: 10, style: String::from("boot") },
    ];

    let in_my_size = shoes_in_my_size(shoes, 10);

    assert_eq!(
        in_my_size,
        vec![
            Shoe { size: 10, style: String::from("sneaker") },
            Shoe { size: 10, style: String::from("boot") },
        ]
    );
}
}

```







