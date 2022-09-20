### 前置知识
与函数（`function`）不同，方法（`method`）是与特定数据类型关联的函数。

- **方法 ( method )**  是一段代码的 **逻辑组合**，用于完成某项特定的任务或实现某项特定的功能。是有属主的，调用的时候必须指定 **属主**。
- **函数（ function）**  没有属主，也就是归属于谁，因此可以直接调用。


 - **静态方法** — 属于某个类型，调用时使用 `::` 运算符。`rust`中叫做关联函数，最常见的::new 实例化结构体使用;
 - **实例方法** — 属于某个类型的实例，调用时使用 `.` 运算符。


***struct*，或者 *structure*，是一个自定义数据类型，允许你命名和包装多个相关的值，从而形成一个有意义的组合。** 

特别类似`js`中对象的数据属性。在本篇中，会对比`元组`与`结构体`的异同，演示结构体的用法，并讨论如何在结构体上定义方法和关联函数来指定与结构体数据相关的行为。

## 结构体

`Rust` 中的结构体`（Struct）`与`元组（Tuple）`都可以将若干个类型不一定相同的数据捆绑在一起形成整体，但结构体的每个成员和其本身都有一个名字，这样访问它成员的时候就不用记住下标了。元组常用于非定义的多值传递，而结构体用于规范常用的数据结构。 **结构体的每个成员叫做"字段"。**

**定义：** 自定义数据类型，允许你命名和包装多个相关的值，从而形成一个有意义的组合，类比其他面向对象中的对象。


```rust
// 开启调试模式，方便观察结构体的数据结构
#[derive(Debug)]
struct Site {
    domain: String,
    name: String,
    nation: String,
    found: u32
}

fn main() {

    let runoob = Site {
        domain: String::from("www.runoob.com"),
        name: String::from("RUNOOB"),
        nation: String::from("China"),
        found: 2013
    };
    
    // 调试输出对象形式，还有{:?} 
    // 结构体实例的访问方式
    println!("{:#?},{},{}",runoob, runoob.name, runoob.nation);
    
    
    // 简化书写，同js
    let domain = String::from("www.runoob.com");
    let name = String::from("RUNOOB");
    let runoob2 = Site {
        domain,  // 等同于 domain : domain,
        name,    // 等同于 name : name,
        nation: String::from("China"),
        traffic: 2013
    };
    
    // 合并相同字段的结构体
    let site = Site {
        domain: String::from("baidu.com"),
        name: String::from("RUNOOB"),
        ..runoob
    };
}
```
### 可变的结构体
```rust
#[derive(Debug)]

struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    user1.email = String::from("anotheremail@example.com");

    println!("{:#?}", user1);
}


// 返回一个结构体实例
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}
```

### 元组结构体
与元组的区别是它有名字和固定的类型格式。它存在的意义是为了处理那些需要定义类型（经常使用）又不想太复杂的简单数据：

```rust
struct Color(u8, u8, u8);
struct Point(f64, f64);
let black = Color(0, 0, 0);
let origin = Point(0.0, 0.0);
println!("black = ({}, {}, {})", black.0, black.1, black.2);
```


### 结构体方法和关联函数
引入问题：计算面积
```js
fn main() {
    let rect1 = (30, 50);
    println!(
        "The area of the rectangle is {} square pixels.",
        area(rect1)
    );
}

fn area(dimensions: (u32, u32)) -> u32 {
    dimensions.0 * dimensions.1
}
```

我们使用结构体为数据命名来为其赋予意义。我们可以将我们正在使用的元组转换成一个有整体名称而且每个部分也有对应名字的数据类型。

`方法（Method）`和`函数（Function）`类似，只不过它是用来操作结构体实例的。`Rust` 语言不是面向对象的，从它所有权机制的创新可以看出这一点。

结构体方法的第一个参数必须是 `&self(===this)`，不需声明类型，因为 `self`不是一种风格而是关键字。


```rust
struct Rectangle { 
  width: u32, 
  height: u32,
}

// 和函数类似，只不过方法是用来操作结构体实例的。
// 每个结构体都允许拥有多个 impl 块
impl Rectangle {

    // 方法可以选择获取 `self` 的所有权，
    // 或者像我们这里一样不可变地借用 `self`，或者可变地借用 `self`
    // 我们并不想获取所有权，只希望能够读取结构体中的数据，而不是写入, 需要写入则是mut &self
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    // 关联函数，主要是用来创建实例的，:: 方式调用，不用传递 &self
    fn creat_rect(size:u8)->Rect {
        Rect {width: size, height: size}
    }

    fn create(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }
    
    fn can_contain(&self,rect: &Rect)->bool{
        self.width > rect.width &&  self.height > rect.height 
    }
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };

    // 方法
    let m1 = rect.area();
    println!(">>>m1: {}", m1);

    // 结构体方法或者叫做关联函数的 调用的方式，
    // 类似于静态方法
    let m2 = Rectangle::create(100, 200);
    println!(">>m2:{:?}", m2);
    
    // 使用普通的方法
    let m3 = compuete3(&rect);
    println!("{}",m3);
}

fn compuete3(x: &Rectangle)->u32{
    x.height * x.width
}
```

### 结构体的所有权

结构体必须掌握字段值所有权，因为结构体失效的时候会释放所有字段。

引用型字段，这需要通过 **"生命周期"** 机制来实现，后续补充这个部分内容

### 结构体的案例

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    println!( "{}",rea(&rect1));
}


// 函数签名解释
// 希望借用结构体而不是获取它的所有权。
// 这样`main` 函数就可以保持 `rect1` 的所有权并继续使用它。
// 所以这就是为什么在函数签名和调用的地方会有 `&`
fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height

```

### 枚举

**Rust 的中表示可有可无的时候使用 Option。有值的时候需要使用 Some 变体。解出 Some(x) 中的 x 值方法是模式匹配。同时标注库也提供了便捷方法如 unwrap。**

**枚举**（*enumerations*），也被称作 *enums*。枚举允许你通过列举可能的 **成员**（*variants*） 来定义一个类型。

**引入正题案例：** 目前被广泛使用的两个主要 IP 标准：IPv4（version four）和 IPv6（version six），因此要枚举出所有的ip就只有这两类。现在 `IpAddrKind` 就是一个可以在代码中使用的自定义数据类型了。


``` rust
#[derive(Debug)]
enum IpAddrKind {
   V4,
   V6,
}

struct IpConStruct {
   kind: IpAddrKind,
   address: String,
}

fn main(){
  
   let home = IpConStruct {
      kind: IpAddrKind::V4,
      address: "127.0.0.1".to_string(),
   };

   let look_back:IpConStruct = IpConStruct { 
      kind: IpAddrKind::V6, 
      address: ("::1").to_string(), 
   };

   use_route_way(&home,&look_back);
}

fn use_route_way(home:&IpConStruct,back:&IpConStruct){
   println!("当前的网络地址是{},类型是{:?}", home.address,back.kind);
}
```
**可以为枚举类成员添加元组属性描述**,可以更加清晰的描述枚举的内容。这样子就不需要结构体了。用枚举替代结构体还有另一个优势：**每个成员可以处理不同类型和数量的数据**。


- 枚举中所有可能的值就叫做枚举的变体。
- 允许数据直接附加到枚举中，这样子就不需要单独的结构体来处理。

```rust
enum IpAddr {
   V4(u8, u8, u8, u8),
   V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));
let loopback = IpAddr::V6(String::from("::1"));
```

**结构体和枚举还有另一个相似点**：就像可以使用 `impl` 来为结构体定义方法那样，也可以在枚举上定义方法。
```rust
fn main() {
    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }

    impl Message {
        fn call(&self) {
            // 在这里定义方法体
        }
    }

    let m = Message::Write(String::from("hello"));
    m.call();
}

```



### match
**枚举的目的是对某一类事物的分类**，**分类的目的是为了对不同的情况进行描述**。

**核心目标是**：*将一个值与一系列的模式相比较，并根据相匹配的模式执行相应代码。*

基于这个原理，往往枚举类最终都会被分支结构处理（许多语言中的 `switch` ）。 `Rust` 通过 `match` 语句来实现分支结构。

也可以当做函数表达式，有返回值存在。

```rust
match 枚举类实例 {
    分类1 => 返回值表达式,
    分类2 => 返回值表达式,
    ...
}
```
```rust
enum Coin {
    Penny,
    Diem,
}

fn main(){
    let cents = value_in_centes(Coin::Diem);
    println!("{}", cents);
}

fn value_in_centes(coin:Coin) ->i32{
    match coin {
        Coin::Penny=>1,
        Coin::Diem=>2,
    }
}
```

#### 绑定值的模式

匹配分支的另一个有用的功能是可以绑定匹配的模式的部分值。这也就是如何从枚举成员中提取值的。

```rust
#[derive(Debug)] 
enum UsState {
    Alabama,
    Alaska,
}
enum Coin {
    Penny,
    Diem,
    Quarter(UsState),
}

fn main(){
    let s = value_in_centes(Coin::Quarter(UsState::Alaska));
    println!("{:?}", s);
}

fn value_in_centes(coin:Coin) ->i32{
    match coin {
        Coin::Penny=>1,
        Coin::Diem=>2,
        Coin::Quarter(state)=>{
            println!("State quarter from {:?}!", state);
            25
        },
    }
}
```


### Option 特殊枚举
`Option` 类型应用广泛因为它编码了一个非常普遍的场景，即一个值要么有值要么没值。从类型系统的角度来表达这个概念就意味着编译器需要检查是否处理了所有应该处理的情况，这样就可以避免在其他编程语言中非常常见的 bug。

然而，空值尝试表达的概念仍然是有意义的：空值是一个因为某种原因目前无效或缺失的值。


问题不在于概念而在于具体的实现。为此，Rust 并没有空值，不过它确实拥有一个可以编码存在或不存在概念的枚举。这个枚举是 `Option<T>`


```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option` 是 `Rust` 标准库中的`枚举类`，这个类用于填补 `Rust` 不支持 `null` 引用的空白。
`Option<T>` 枚举是如此有用以至于它甚至被包含在了 `prelude` 之中，你不需要将其显式引入作用域。

> 泛型类型参数：<T> 意味着 Option 枚举的 Some 成员可以包含任意类型的数据
```rust
// 当有一个 `Some` 值时，我们就知道存在一个值，而这个值保存在 `Some` 中。
let s = Some(5);
let x = Some("anikin");

// 如果使用 `None` 而不是 `Some`，需要告诉 Rust `Option<T>` 是什么类型的，
// 编译器只通过 `None` 值无法推断出 `Some` 成员保存的值的类型。
let n:Option<i32> = None();
```

使用场景：

```rust
fn main() {
    let var_name = String::from("anikin");
    let s1 = Some(var_name);
    match s1 {
        Option::Some(something) => println!("some things: {}", something),
        Option::None => println!("opt is nothing!"),
    }
}
```
省略作用域：
```rust
fn main() {
    let s = Some(100);
    match s {
        Some(100) => println!("Yes"),
        
        // 其他场景
        _ => println!("No"), 
    }
}
```

### if let 语法

`if let` 语法让我们以一种不那么冗长的方式结合 `if` 和 `let`，来处理只匹配一个模式的值而忽略其他模式的情况。

```
if let 匹配值 = 源变量 {
    语句块
}
```

`if let` 语法可以认为是只区分两种情况的 `match` 语句的"语法糖"。使用`if-let`重写上面的：

```rust
fn main() {
    let _s = Some(100);
    if let Some(100) = _s {
        println!("yas");
    } else {
        println!("No");
    }
}
```

匹配`Option`:
```rust
fn plus_one(x:Option<i32>)->Option<i32>{
    if let Some(x) = x {
        Some(x+10)
    }
    else {
        None
    }
}

```

在补充一个案例：
```rust
fn main(){
    let num = 100;
    let check_odd = is_odd(num).unwrap(); // ok的时候会直接执行
    let check_odd_2 = is_odd(200).expect("sorry, it panic!");  // panic 有错误消息

    
    let check_data = is_odd(num);
    
    // 使用match 来匹配
     match check_data {
        Some(data) => {
            if data == true {
                println!("yes,odd");
            }
        },
        None =>{
            println!("not oddd");
        }
     }


    // 另外一种简单的写法：只匹配一种场景模式
    if let Some(true) = check_data {
        println!("yes,odd");
    }

}

fn is_odd(num: u8)->Option<bool>{
    if num % 2 == 0 {
        Some(true)
    }else {
        None
    }
}
 
```


### 其他 
很不错的一篇文文章介绍本节内容： https://www.twle.cn/c/yufei/rust/rust-basic-enums.html

