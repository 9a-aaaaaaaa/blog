随着项目的增长，你可以通过将代码分解为多个模块和多个文件来组织代码。一个包可以包含多个二进制 `crate` 项和一个可选的 `crate` 库。伴随着包的增长，你可以将包中的部分代码提取出来，做成独立的 `crate`，这些 `crate` 则作为外部依赖项。

除了对功能进行分组以外，封装实现细节可以使你更高级地重用代码：**你实现了一个操作后，其他的代码可以通过该代码的公共接口来进行调用，而不需要知道它是如何实现的**。

`Rust` 有许多功能可以让你管理代码的组织，包括哪些内容可以被公开，哪些内容作为私有部分，以及程序每个作用域中的名字。这些功能。这有时被称为 “模块系统`（the module system）`”，包括：

-   **包**（*Packages*）： `Cargo` 的一个功能，它允许你构建、测试和分享 `crate`。
-   **Crates** ：一个模块的树形结构，它形成了库或二进制项目。
-   **模块**（*Modules*）和 **use**： 允许你控制作用域和路径的私有性。
-   **路径**（*path*）：一个命名例如结构体、函数或模块等项的方式

# 包 | crate 

### crate 
Rust 中，`crate` 是一个独立的可编译单元。`crate` 是一个二进制项或者库。具体说来，就是一个或一批文件（如果是一批文件，那么有一个文件是这个 crate 的入口）。它编译后，会对应着生成一个可执行文件或一个库。*crate root* 是一个源文件，Rust 编译器以它为起始点，并构成你的 crate 的根模块。

**Rust 中的可执行二进制文件程序或者一个库就是一个** `carate`。**可执行二进制文件程序和库的最大区别，就是可执行二进制程序有一个包含 `main()` 方法作为程序入口。**

**而一个库 (`library crate` ) 是一组可以在其他项目中重用的组件。与二进制包不同，库包没有入口函数（ `main()` 方法）**。

一个 `crate` 会将一个作用域内的相关功能分组到一起，使得该功能可以很方便地在多个项目之间共享。类似前端的`npm`包文件。

### 包

*包*（*package*） 是提供一系列功能的一个或者多个 crate。一个包会包含有一个 *Cargo.toml* 文件，阐述如何去构建这些 crate。包中所包含的内容由几条规则来确立。一个包中至多 **只能** 包含一个库 crate(library crate)；包中可以包含任意多个二进制 crate(binary crate)；包中至少包含一个 crate，无论是库的还是二进制的。

创建一个只包含 *src/main.rs* 的包输入命令 `cargo new`：
```rust
$ cargo new my-project
     Created binary (application) `my-project` package
$ ls my-project
Cargo.toml
src
$ ls my-project/src
main.rs
```
`Cargo` 遵循约定：
- *src/main.rs* 就是一个与包同名的二进制 `crate` 的 `crate` 根。
- `Cargo` 知道如果包目录中包含 *src/lib.rs*，则包带有与其同名的库 `crate`，且 *src/lib.rs* 是 `crate` 根。`crate` 根文件将由 `Cargo` 传递给 `rustc` 来实际构建库或者二进制项目。

上面的创建意味着它只含有一个名为 `my-project` 的二进制 `crate`。

如果一个包同时含有 *src/main.rs* 和 *src/lib.rs*，则它有两个 crate：**一个库和一个二进制项，且名字都与包相同**。通过将文件放在 *src/bin* 目录下，一个包可以拥有多个二进制 crate：每个 *src/bin* 下的文件都会被编译成一个独立的二进制 `crate`。

# 模块系统

**模块** 让我们可以将一个 `crate` 中的代码进行分组，以提高**可读性与重用性**。模块还可以控制项的 *私有性*，即项是可以被外部代码使用的（*public*），还是作为一个内部实现的内容，不能被外部代码使用（*private*）。


主要介绍以下内容：
- 允许你命名项的 *路径*（*paths*）；
- 用来将路径引入作用域的 `use` 关键字；
- 以及使项变为公有的 `pub` 关键字。
- 还将讨论 `as` 关键字
- 外部包
- `glob` 运算符

`Rust` 提供了一个关键字 `mod`，它可以在一个文件中定义一个模块，或者引用另外一个文件中的模块。**子模块。**

关于模块的一些要点：

1.  每个 crate 中，默认实现了一个隐式的 `根模块（root module）`；
1.  模块的命名风格也是 `lower_snake_case`，跟其它的 Rust 的标识符一样；
1.  模块可以嵌套；
1.  模块中可以写任何合法的 Rust 代码；


`Rust` 中定义一个模块语法：
```
mod my_module;
```
这里，编译器在相同的目录下查找`my_module.rs`或者`my_module/mod.rs`。


`Rust` 语言默认所有的模块和模块内的函数都是私有的，也就是只能在模块内部使用。如果一个模块或者模块内的函数需要导出为外部使用，则需要添加 `pub` 关键字。


```rust
//公开的模块
pub mod a_public_module {
   pub fn a_public_function() {
      // 公开的方法
   }
   fn a_private_function() {
      // 私有的方法
   }
}
//私有的模块
mod a_private_module {

   // 私有的方法
   fn a_private_function() {
   }
}
```

不过需要注意的是，私有模块的所有函数都必须是私有的，而公开的模块，则即可以有公开的函数也可以有私有的函数。

#### 入题案例
创建一个餐厅(`restrant`)的库文件：
```rust

// 创建库文件
cargo new --lib restaurant

// src/lib.rs
#![allow(unused_variables)]
fn main() {
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}
        fn server_order() {}
        fn take_payment() {}
    }
}
}
```

前面介绍了`src/main.rs` 和 `src/lib.rs` 叫做 crate 根。之所以这样叫它们的原因是，这两个文件的内容都是一个从名为 `crate` 的模块作为根的 crate 模块结构，称为 *模块树*（*module tree*）,下图展示了上面的模块树：

```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment

```

#### 路径用于模块系统

Rust 如何在模块树中找到一个项的位置，我们使用路径的方式。由两种形式的路径：
-   **绝对路径**（*absolute path*）从 crate 根开始，以 crate 名或者字面值 `crate` 开头。
-   **相对路径**（*relative path*）从当前模块开始，以 `self`、`super` 或当前模块的标识符开头。

```rust
// lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("add_to_waitlist!");
        }
    } 
}


pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();
}

```
选择使用相对路径还是绝对路径，还是要取决于你的项目。

模块不仅对于你组织代码很有用。他们还定义了 Rust 的 *私有性边界*（*privacy boundary*）：这条界线不允许外部代码了解、调用和依赖被封装的实现细节。所以，如果你希望创建一个私有函数或结构体，你可以将其放入模块。

**Rust 中默认所有项（函数、方法、结构体、枚举、模块和常量）都是私有的。父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用他们父模块中的项。** Rust 选择以这种方式来实现模块系统功能，因此默认隐藏内部实现细节。

#### 使用super起始的关机键字
我们还可以使用 `super` 开头来构建从父模块开始的相对路径。这么做类似于文件系统中以 `..` 开头的语法。`super` **开头的相对路径从父目录开始调用函数。**
```rust
// lib.rs
fn server_order(){
    println!("server_order");
}

mod back_of_house{
    fn fix_incorrect_order(){
        // 重点是在模块内部使用，
        super::server_order();
        cook_order();
    }

    fn cook_order(){
        println!("cook_order");
    }
}
```

#### 使用pub 定义公共的结构体和枚举
可以使用 `pub` 来设计公有的结构体和枚举，不过有一些额外的细节需要注意，如果我们在一个结构体定义的前面使用了 `pub` ，这个结构体会变成公有的，但是这个结构体的字段仍然是私有的。我们可以根据情况决定每个字段是否公有。

将枚举设为公有，则它的所有成员都将变为公有。我们只需要在 `enum` 关键字前面加上 `pub`。


```rust
// lib.rs
mod back_of_house{
    pub struct Breakfast{
        pub toast: String,  // 共有属性
        seasonal_fruit: String, // 私有属性
    }

    // 注意，这个添加位置不是在最前面
    #[derive(Debug)]
    pub enum Appetizer{
        Soup,
        Salad,
    }

    impl Breakfast {
        pub fn summer(toast:&str) ->Breakfast{
            Breakfast{
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }


}

// 暴露个外部包使用
pub fn eat_at_restaurant() {
    let mut meal = back_of_house::Breakfast::summer("Rye");
    
    // 可以修改共有的属性
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);
}


pub fn eat_in_enum_restrant(){
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
    println!("You eat: {:?}-{:?}", order1, order2);

}

```

再单独创建一个`main.rs`来测试这个库文件：
```rust
// restrant 是库名称，这个可以在cargo.toml里面看到。
use restrant::eat_at_restaurant;
use restrant::eat_in_enum_restrant;

fn main(){
    eat_at_restaurant();
    eat_in_enum_restrant();
}
```

#### 使用 `use` 关键字将名称引入作用域
上面编写的库文件用于调用函数的路径都很冗长且重复，并不方便。上面的`add_to_waitlist` 函数的绝对路径还是相对路径，每次我们想要调用 `add_to_waitlist` 时，都必须指定`front_of_house` 和 `hosting`。幸运的是，有一种方法可以简化这个过程。我们可以一次性将路径引入作用域，然后使用 `use` 关键字调用该路径中的项，就如同它们是本地项一样。

```rust
// lib.rs
mod front_of_house{
    pub mod hosting{
        pub fn add_to_wailist() {
            println!("add_to_wailist");
        }
    }
}

// 在作用域中增加 `use` 和路径类似于在文件系统中创建软连接（符号连接，symbolic link）。
use crate::front_of_house::hosting;
pub fn eat_at_restaurant(){
    hosting::add_to_wailist();
}

// main.rs
use restrant::eat_at_restaurant;
fn main(){
    eat_at_restaurant();
}

```
#### 使用as重命名

使用 `use` 将两个同名类型引入同一作用域这个问题还有另一个解决办法：在这个类型的路径后面，我们使用 `as` 指定一个新的本地名称或者别名。

```rust
#![allow(unused_variables)]
fn main() {
use std::fmt::Result;
use std::io::Result as IoResult;

    fn function1() -> Result {
        // --snip--
        Ok(())
    }

    fn function2() -> IoResult<()> {
        // --snip--
        Ok(())
    }
}

```
#### 将模块分割到不同的文件中
目前为止，所有的例子都在一个文件中定义多个模块。当模块变得更大时，可能想要将它们的定义移动到单独的文件中，从而使代码更容易阅读。

将上面的 `front_of_house` 模块移动到属于它自己的文件 *src/front_of_house.rs* 中，通过改变 crate 根文件，使其包含示例 7-21 所示的代码。在这个例子中，`crate` 根文件是 *src/lib.rs*，这也同样适用于以 *src/main.rs* 为 `crate` 根文件的二进制 `crate` 项。

```rust
// lib.rs
// 在 mod front_of_house 后使用分号，而不是代码块，
// 这将告诉 Rust 在另一个与模块同名的文件中加载模块的内容。
mod front_of_house;
pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() ->String{
    hosting::add_to_waitlist()
}
```

创建：`src/front_of_house.rs`

```rust
pub mod hosting {
    pub fn add_to_waitlist() ->String {
         let ad = String::from("add_to_wailist");
         ad
    }
}
```
测试 `main.rs`:
```rust
use restrant::eat_at_restaurant;
fn main(){
    let res = eat_at_restaurant();
    println!("Output: {}",res);
}
```

接着上面的继续优化，将`hosting`模块也分离出去，创建`front_of_house`文件夹,删除原先的`front_of_house.rs`文件：

`src/front_of_house/mod.rs`:

```rust
pub mod hosting; 
```
`src/front_of_house/hosting.rs`:
```rust
pub fn add_to_waitlist() ->String {
     let ad = String::from("add_to_wailist");
     ad
}
```
模块树依然保持相同，`eat_at_restaurant` 中的函数调用也无需修改继续保持有效，即便其定义存在于不同的文件中。这个技巧让你可以在模块代码增长时，将它们移动到新文件中。


 #### 案例1：外部调用
 目录结构如下：
 ```
ruby
├── Cargo.toml
└── src
    └── config.rs
    └── main.rs
```
演示代码如下：

 ```rust
// main.rs 
mod config;

fn main() {
    config::print_config();
    println!("Hello, world!");
}

// config.rs
pub fn print_config() {
    println!("config");
}
```


#### 案例2：内部调用
eg： 在 `main.rs` 中定义一个模块：

```rust
pub mod movies {
   pub fn play(name:String) {
      println!("Playing movie {}",name);
   }
}

fn main(){
   movies::play("Herold and Kumar".to_string());
}

// 输出结果是：Playing movie Herold and Kumar
```


#### 案例3：多文件调用
让我们尝试在`main.rs`中调用定义在`routes/health_route.rs`里的`print_health_route`函数。
 ```
ruby
├── Cargo.toml
└── src
    └── route
        └── health_route.rs
        └── mod.rs
    └── config.rs
    └── main.rs
```
文件内容是：

```rust

// routes/health_route.rs
pub fn print_health_route() {
    println!("health_route");
}

// routes/mod.rs
pub mod health_route;

// main.rs
mod config;
mod routes;

fn main() {
    routes::health_route::print_health_route();
    config::print_config();
    println!("Hello, world!");
}

```

### use 关键字

每次调用外部的模块中的函数或结构体都要添加 **模块限定**，这样似乎有点啰嗦了。可以先在文件头部先把需要调用的**函数/结构体**引用进来，然后调用的时候就可以省去 **模块限定** 。

Rust 从 [C++](https://www.twle.cn/l/yufei/cplusplus/cplusplus-basic-namespaces.html) 借鉴了 `use` 关键字。 `use` 关键字用于文件头部预先引入需要用到的外部模块中的函数或结构体。

使用的方式是：

```rust
use public_module_name::function_name;
```

上面的case改写如下：
```rust
pub mod movies {
   pub fn play(name:String) {
      println!("Playing movie {}",name);
   }
}

use movies::play;

fn main(){
   play("Herold and Kumar ".to_string());
}
```

单独创建一个项目，测试模块：
```
foo
├── Cargo.toml
└── src
    └── util.rs
    └── main.rs
```
`util.rs`的内容：

```rust
pub fn print_code() {
    println!("{}", 25);
}
```

`main.rs`里面调用：

```rust
mod util;
use util::print_aaa;

fn main () {
    print_code();
}
```


 ### 模块嵌套
 
 `Rust` 允许一个模块中嵌套另一个模块，换种说法，就是允许多层级模块。
 
```rust
pub mod movies {
   pub mod english {
      pub mod comedy {
         pub fn play(name:String) {
            println!("Playing comedy movie {}",name);
         }
      }
   }
}
use movies::english::comedy::play; // 导入公开的模块

fn main() {
   // 短路径语法
   play("Herold and Kumar".to_string());
   play("The Hangover".to_string());

   // 全路径语法
   movies::english::comedy::play("Airplane!".to_string());
}
```

## 参考文章：
- https://zhuanlan.zhihu.com/p/164556350
- https://wiki.jikexueyuan.com/project/rust-primer/module/module.html
