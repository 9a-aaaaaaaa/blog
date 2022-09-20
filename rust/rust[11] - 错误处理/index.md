Rust 将错误组合成两个主要类别：**可恢复错误**（*recoverable*）和 **不可恢复错误**（*unrecoverable*）。
- 可恢复错误通常代表向用户报告错误和重试操作是合理的情况，比如未找到文件。使用`Result<T, E>`来处理。
- 不可恢复错误(遇到错误时停止程序执行)错误 `panic!`; 通常是 bug 的同义词，比如尝试访问超过数组结尾的位置。

# 不可恢复错误

`panic!`宏。当执行这个宏时，程序会打印出一个错误信息，展开并清理栈数据，然后接着退出。

 ### 对应 panic 时的栈展开或终止

panic 时程序：
- (默认)**展开**（*unwinding*），这意味着 Rust 会回溯栈并清理它遇到的每一个函数的数据，不过这个回溯并清理的过程有很多工作。

- 或者选择 **终止**（*abort*），这会不清理数据就退出程序。那么程序所使用的内存需要由操作系统来清理。如果你需要项目的最终二进制文件越小越好，配置：*Cargo.toml*：如果你想要在release模式中 panic 时直接终止
```rust
[profile.release]
panic = 'abort'
```

### panic! 和 backtrace
```rust
fn main(){
    show_panic();
}

fn show_panic(){
    panic!("This is a panic function!");
}
```
执行后的结果是：
```rust
**Compiling** async v0.1.0 (/Users/qiududu/workspace/weibo)
**Finished** dev [unoptimized + debuginfo] target(s) in 0.13s
**Running** `target/debug/async`
// 展示了panic信息和main.rs中的调用
thread 'main' panicked at 'This is a panic function!', src/main.rs:6:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

`RUST_BACKTRACE` 环境变量来得到一个 backtrace。*backtrace* 是一个执行到目前位置所有被调用的函数的列表。Rust 的 backtrace 跟其他语言中的一样

```rust
fn main() {
    let v = vec![1, 2, 3];
    // Rust 会 panic
    v[99];
}
```
这个情况其他这样语言会尝试直接提供所要求的值，即便这可能不是你期望的：你会得到任何对应 vector 中这个元素的内存位置的值，甚至是这些内存并不属于 vector 的情况。这被称为 **缓冲区溢出**（*buffer overread*），并可能会导致安全漏洞，比如攻击者可以像这样操作索引来读取储存在数组后面不被允许的数据。
```rust
// 启用backtrace
RUST_BACKTRACE=1 cargo run
```
# 可恢复的错误
`Result` 枚举，它定义有如下两个成员，`Ok` 和 `Err`：`T` 和 `E` 是泛型类型参数；

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
- `T` 代表成功时返回的 `Ok` 成员中的数据的类型。
- `E` 代表失败时返回的 `Err` 成员中的错误的类型。因为 `Result` 有这些泛型类型参数，我们可以将 `Result` 类型和标准库中为其定义的函数用于很多不同的场景，这些情况中需要返回的成功值和失败值可能会各不相同。

### 匹配不同的错误

`File::open` 返回的 `Err` 成员中的值类型 `io::Error`，它是一个标准库中提供的结构体。这个结构体有一个返回 `io::ErrorKind` 值的 `kind` 方法可供调用。`io::ErrorKind` 是一个标准库提供的枚举，它的成员对应 `io` 操作可能导致的不同错误类型。

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => {
            println!("error is: {:?}", error);
            match error.kind() {
                ErrorKind::NotFound => 
                    match File::create("hello.txt") {
                        Ok(fc) => fc,
                        Err(e) => panic!("Problem creating the file: {:?}", e),
                    },
                other_error => panic!("Problem opening the file: {:?}", other_error),
            }
        },
    };

    println!("f is:{:?}",f);
}
```
执行结果是：
```rust
error is: Os { code: 2, kind: NotFound, message: "No such file or directory" }
f is:File { fd: 3, path: "/Users/qiududu/workspace/weibo/hello.txt", read: false, write: true }
```

使用闭包以后的写法更加简练：
```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });
}
```
`Result<T,E>`都拥有`unwrap_or_else`,Returns the contained [`Ok`](https://doc.rust-lang.org/core/result/enum.Result.html#variant.Ok "Ok") value or computes it from a closure.

### unwrap和expect

`match` 能够胜任它的工作，不过它可能有点冗长并且不总是能很好的表明其意图。`Result<T, E>` 类型定义了很多辅助方法来处理各种情况。其中之一叫做 `unwrap`：

如果 `Result` 值是成员 `Ok`，`unwrap` 会返回 `Ok` 中的值。如果 `Result` 是成员 `Err`，`unwrap` 会为我们调用 `panic!`。

```rust
use std::fs::File;
fn main() {
   let f = File::open("hello.txt").unwrap();
   println!("f is {:?}", f);
}
```
执行成功以后，文件存在，不存在则直接`panic`。
```
f is File { fd: 3, path: "/Users/qiududu/workspace/weibo/hello.txt", read: true, write: false }
```

使用 `expect` 可以提供一个好的错误信息可以表明你的意图并更易于追踪 `panic` 的根源，但是两者都返回的是返回文件句柄。
```rust
use std::fs::File;
fn main() {
   let f = File::open("hello.txt").expect("文件不存在！");
   println!("f is {:?}", f);
}
```
执行结果是：
```
**Compiling** async v0.1.0 (/Users/qiududu/workspace/weibo)
**Finished** dev [unoptimized + debuginfo] target(s) in 0.27s
**Running** `target/debug/async`

thread 'main' panicked at '文件不存在！: Os { code: 2, kind: NotFound, message: "No such file or directory" }', src/main.rs:3:36
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```


### 传播错误

**传播**（*propagating*）错误：当编写一个其实现会调用一些可能会失败的操作的函数时，除了在这个函数中处理错误外，还可以选择让调用者知道这个错误并决定该如何处理。**向上传递。**

这样能更好的控制代码调用，因为比起你代码所拥有的上下文，调用者可能拥有更多信息或逻辑来决定应该如何处理错误。

```rust
use std::io;
use std::io::Read;
use std::fs::File;

fn main(){
    let read_res = read_username_from_file();
    println!("==>{:?}", read_res);
}

fn read_username_from_file()->Result<String,io::Error> {
    let f = File::open("hello.txt");

    let mut f = match f{
        Ok(file) => file,
        // 这里return 代表直接结束这个函数，不在进行下去
        Err(e)=> return Err(e),
    };

    let mut s = String::new();

   
    match f.read_to_string(&mut s) {
        Ok(_)=>Ok(s),
        // 不过并不需要显式的调用 `return`，因为这是函数的最后一个表达式
        Err(e)=>Err(e),
    }
}

```
### 传播错误简写 ?
必须是在`Result`里面使用，`?` 运算符消除了大量样板代码并使得函数的实现更简单，主要是代表`match`。

```rust
fn read_username_from_file2() -> Result<String, io::Error> {
    let mut f = File::open("hello2.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}
```
`Result` 值之后的 `?` 和处理 `Result` 值的 `match` 表达式有着完全相同的工作方式。

 如果 `Result` 的值是 `Ok`，这个表达式将会返回 `Ok` 中的值而程序将继续执行。如果值是 `Err`，`Err` 中的值将作为整个函数的返回值，就好像使用了 `return` 关键字一样，这样错误值就被传播给了调用者。


链式的写法：
```rust
fn read_username_from_file2() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello2.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```


# panic! 的标准

在当有可能会导致有害状态的情况下建议使用 `panic!` —— 在这里，有害状态是指当一些假设、保证、协议或不可变性被打破的状态，例如无效的值、自相矛盾的值或者被传递了不存在的值 —— 外加如下几种情况：

-   有害状态并不包含 **预期** 会偶尔发生的错误
-   在此之后代码的运行依赖于不处于这种有害状态
-   当没有可行的手段来将有害状态信息编码进所使用的类型中的情况















