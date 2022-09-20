# 1  主要解决问题
-   如何创建线程来同时运行多段代码。
-   **消息传递**（*Message passing*）并发，其中通道（channel）被用来在线程间传递消息。
-   **共享状态**（*Shared state*）并发，其中多个线程可以访问同一片数据。
-   `Sync` 和 `Send` trait，将 Rust 的并发保证扩展到用户定义的以及标准库提供的类型中。
# 创建线程同时运行代码

在大部分现代操作系统中，已执行程序的代码在一个 **进程**（*process*）中运行，操作系统则负责管理多个进程。在程序内部，也可以拥有多个同时运行的独立部分。运行这些独立部分的功能被称为 **线程**（*threads*）。

将程序中的计算拆分进多个线程可以改善性能，因为程序可以同时进行多个任务，不过这也会增加复杂性。因为线程是同时运行的，所以无法预先保证不同线程中的代码的执行顺序。这会导致诸如此类的问题：

-   竞争状态（Race conditions），多个线程以不一致的顺序访问数据或资源
-   死锁（Deadlocks），两个线程相互等待对方停止使用其所拥有的资源，这会阻止它们继续运行
-   只会发生在特定情况且难以稳定重现和修复的 bug

### 1： 运行时
实际上编程语境中的 `runtime` 至少有三个含义，而目前的回答都只侧重讲了其中的某一个，所以看起来很令人困惑。这几个含义分别可以这样概括：

- 指程序运行的时候。例句：「*Rust 比 C 更容易将错误发现在编译时而非运行时。* 」

- 指 运行时库，**即 glibc 这类原生语言的标准库**。例句：「*C 程序的 malloc 函数实现需要由运行时提供。
- 指[运行时系统，**即某门语言的宿主环境**。例句：「*Node.js 是一个 JavaScript 的运行时。* 」

运行时rumtime就是**程序运行的时候**。运行时库就是**程序运行的时候**所需要依赖的库。运行的时候指的是指令加载到内存并由CPU执行的时候。C代码编译成可执行文件的时候，指令没有被CPU执行，这个时候算是编译时，就是**编译的时候**。

### 2: 线程模型
编程语言有一些不同的方法来实现线程。很多操作系统提供了创建新线程的 API。这种由编程语言调用操作系统 API 创建线程的模型有时被称为 *1:1*，一个 OS 线程对应一个语言线程。 rust采用这类模型。

很多编程语言提供了 **绿色**（*green*）线程，使用绿色线程的语言会在不同数量的 OS 线程的上下文中执行它们。为此，绿色线程模式被称为 *M:N* 模型。

### 3： 创建
```rust
use std::thread;
use std::time::Duration;
fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("child {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
    // 交替执行，主线程结束，不管子线程是否结束全部结束
}

```
### 4： 使用join等待
 通过调用 handle 的 `join` 会阻塞当前线程直到 handle 所代表的线程结束。**阻塞**（*Blocking*） 线程意味着阻止该线程执行工作或退出。
```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    // 先执行完子线程
     handle.join().unwrap();

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }

    // 交替打印
    handle.join().unwrap();
}

```

### 5：move 闭包
`move` 关键字强制闭包获取其使用的环境值的所有权。这个技巧在创建新线程将值的所有权从一个线程移动到另一个线程时最为实用。

```rust
use std::thread;
fn main() {
    let v = vec![1, 2, 3];
    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });
    handle.join().unwrap();
}

```
# 2  使用消息传递跨线程的进行通信
一个日益流行的确保安全并发的方式是 **消息传递**（*message passing*），这里线程或 actor 通过发送包含数据的消息来相互沟通。这个思想来源于 [Go 编程](https://golang.org/doc/effective_go.html) 的口号：“不要通过共享内存来通讯；而是通过通讯来共享内存。`Do not communicate by sharing memory; instead, share memory by communicating.`


Rust 中一个实现消息传递并发的主要工具是 **通道**（*channel*), 编程中的通道有两部分组成，一个发送者（`transmitter`）和一个接收者（`receiver`）。当发送者或接收者任一被丢弃时可以认为通道被 **关闭**（*closed*）了。


### 1: mpsc
`mpsc` 是 **多个生产者，单个消费者**（*multiple producer, single consumer*）的缩写。

简而言之，Rust 标准库实现通道的方式意味着一个通道可以有多个产生值的 **发送**（*sending*）端，但只能有一个消费这些值的 **接收**（*receiving*）端。

`mpsc::channel` 函数返回一个元组。

```rust
use std::thread;
use std::sync::mpsc;

fn main() {
     //  tx: **发送者**（*transmitter*）
     //  rx: **接收者**（*receiver*
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        // `send` 方法返回一个 `Result<T, E>` 类型，所以如果接收端已经被丢弃了，将没有发送值的目标，所以发送操作会返回错误
        tx.send(val).unwrap();
    });

    // 一旦发送了一个值，`recv` 会在一个 `Result<T, E>` 中返回它。当通道发送端关闭，`recv` 会返回一个错误表明不会再有新的值到来了
   let rx_data = rx.recv().unwrap();
   println!("receive data is: {}", rx_data);  
   
   
   
   // `try_recv` 不会阻塞，相反它立刻返回一个 `Result<T, E>`。
   //  如果线程在等待消息过程中还有其他工作时使用 `try_recv` 很有用：
   //  可以编写一个循环来频繁调用 `try_recv`，在有可用消息时进行处理，
   //  其余时候则处理一会其他工作直到再次检查。
   for s in 1..10 {
        println!("每秒轮询消息，第{}次", s);
        // 每秒查看是否收到消息
        thread::sleep(Duration::from_millis(500));
        if let Result::Ok(received) = rx.try_recv() {
          println!("【【【【收到消息】】】】：{}", received);
          break // 收到消息后终止轮询
        }

        println!("做一些其余的事情，而不是全部在等待")
    }
}
```

### 2: 通道和所有权转移
```rust
use std::thread;
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
        println!("val is {}", val);
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```
会产生错误，`send` 函数获取其参数的所有权并移动这个值归接收者所有。这可以防止在发送后再次意外地使用这个值；所有权系统检查一切是否合乎规则。
```
 let val = String::from("hi");
   | --- move occurs because `val` has type `String`, which does not implement the `Copy` trait
9  |tx.send(val).unwrap();
   |--- value moved here
10 | println!("val is {}", val);
   | ^^^ value borrowed here after move
```

### 3: 发送多个值

```rust
use std::thread;
use std::sync::mpsc;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vacs = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vacs {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(300));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```
而是将 `rx` 当作一个迭代器。对于每一个接收到的值，我们将其打印出来。当通道被关闭时，迭代器也将结束.
因为主线程中的 `for` 循环里并没有任何暂停或等待的代码，所以可以说主线程是在等待从新建线程中接收值。

### 4； 克隆发送者
```rust
use std::thread;
use std::sync::mpsc;
use std::time::Duration;

fn main() {
// --snip--

let (tx, rx) = mpsc::channel();

let tx1 = tx.clone();
thread::spawn(move || {
    let vals = vec![
        String::from("hi"),
        String::from("from"),
        String::from("the"),
        String::from("thread"),
    ];

    for val in vals {
        tx1.send(val).unwrap();
        thread::sleep(Duration::from_secs(1));
    }
});

thread::spawn(move || {
    let vals = vec![
        String::from("more"),
        String::from("messages"),
        String::from("for"),
        String::from("you"),
    ];

    for val in vals {
        tx.send(val).unwrap();
        thread::sleep(Duration::from_secs(1));
    }
});

for received in rx {
    println!("Got: {}", received);
}

// --snip--
}

```
执行结果是交替的，不可预期的。
```rust
Got: hi
Got: : more
Got: from
Got: : messages
Got: the
Got: : for
Got: thread
Got: : you
```

# 3 共享状态并发
虽然消息传递是一个很好的处理并发的方式，但并不是唯一一个。
在某种程度上，任何编程语言中的通道都类似于单所有权，因为一旦将一个值传送到通道中，将无法再使用这个值。共享内存类似于多所有权：多个线程可以同时访问相同的内存位置。

### 1: **互斥器**（*mutex*）是 *mutual exclusion*
`mutex`任意时刻，其只允许一个线程访问某些数据。为了访问互斥器中的数据，线程首先需要通过获取互斥器的 **锁**（*lock*）来表明其希望访问数据。锁是一个作为互斥器一部分的数据结构，它记录谁有数据的排他访问权。因此，我们描述互斥器为通过锁系统 **保护**（*guarding*）其数据。

互斥器以难以使用著称，因为你不得不记住：

1.  在使用数据之前尝试获取锁。
1.  处理完被互斥器所保护的数据之后，必须解锁数据，这样其他线程才能够获取锁。

正确的管理互斥器异常复杂，这也是许多人之所以热衷于通道的原因。然而，在 Rust 中，得益于类型系统和所有权，我们不会在锁和解锁上出错。如果另一个线程拥有锁，并且那个线程 panic 了，则 `lock` 调用会失败。在这种情况下，没人能够再获取锁，所以这里选择 `unwrap` 并在遇到这种情况时使线程 panic。

```rs
use std::sync::Mutex;
fn main() {
    let m = Mutex::new(5);
    {
        // `lock` 方法获取锁，以访问互斥器中的数据。这个调用会阻塞当前线程，直到我们拥有锁为止
        let mut num = m.lock().unwrap();
        *num = 6;
    }
    println!("m = {:?}", m); // 6
}

```
一旦获取了锁，就可以将返回值（在这里是`num`）视为一个其内部数据的可变引用了。`Mutex<i32>` 并不是一个 `i32`，所以 **必须** 获取锁才能使用这个 `i32` 值。

`Mutex<T>` 是一个智能指针。更准确的说，`lock` 调用 **返回** 一个叫做 `MutexGuard` 的智能指针。这个智能指针实现了 `Deref` 来指向其内部数据；其也提供了一个 `Drop` 实现当 `MutexGuard` 离开作用域时自动释放锁。为此，我们不会冒忘记释放锁并阻塞互斥器为其它线程所用的风险，因为锁的释放是自动发生的。

### 2: 在线程间共享 `Mutex<T>`
```rs
use std::sync::{Mutex,Arc};
use std::thread;

fn main(){
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..10{
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move ||{
            let mut num = counter.lock().unwrap();
            *num +=1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();    
    }

    println!("result {}", *counter.lock().unwrap());
}
```

`Arc<T>` **正是** 这么一个类似 `Rc<T>` 并可以安全的用于并发环境的类型。字母 “a” 代表 **原子性**（*atomic*），所以这是一个**原子引用计数**（*atomically reference counted*）类型。原子性是另一类这里还未涉及到的并发原语：请查看标准库中 `std::sync::atomic` 的文档来获取更多细节。其中的要点就是：原子性类型工作起来类似原始类型，不过可以安全的在线程间共享。

`Arc<T>` 和 `Rc<T>` 有着相同的 API。


# 参考引用
- https://www.zhihu.com/question/20607178
- https://rustwiki.org/zh-CN/book/ch16-01-threads.html

