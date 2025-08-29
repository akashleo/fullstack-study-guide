# 20 Python Interview Questions (Backend-Oriented)

```
## Table of Contents
1. [Python’s Key Features for Web Development](#q1)
2. [Python’s GIL and Its Effect on Concurrency](#q2)
3. [Multithreading vs. Multiprocessing in Python](#q3)
4. [Memory Management in Python](#q4)
5. [Python’s Core Data Structures and When to Use Them](#q5)
6. [Decorators: Implementation and Use in Web Apps](#q6)
7. [@staticmethod, @classmethod, and Instance Methods](#q7)
8. [Exception Handling, raise vs assert](#q8)
9. [Context Managers (with statement) and Internal Working](#q9)
10. [Optimizing Python Web Application Performance](#q10)
11. [Shallow Copy vs Deep Copy](#q11)
12. [Asynchronous Programming (async/await)](#q12)
13. [Generators and Iterators](#q13)
14. [Garbage Collector and Managing Memory Leaks](#q14)
15. [__slots__ and Their Use Cases](#q15)
16. [Type Hinting in Large Applications](#q16)
17. [is vs == in Python](#q17)
18. [Structuring Modules and Packages in Scalable Projects](#q18)
19. [Security Concerns and Mitigation in Python Applications](#q19)
20. [Testing and Debugging (unittest/pytest, pdb)](#q20)

```

## 1. Python’s Key Features for Web Development {#q1}

```
**Answer:**
Python offers a clean, readable syntax that accelerates development and reduces maintenance costs. Its robust standard library supports tasks like HTTP request handling, JSON encoding/decoding, and regular expressions out of the box. Popular frameworks such as Django and Flask promote rapid application development, enforce best practices (MVC, ORM), and integrate well with frontend tools and databases. Python also supports multiple programming paradigms (OOP, functional, procedural), and its huge ecosystem of packages (PyPI) allows easy extension for authentication, API design, and background task processing.
```

 

## 2. Python’s GIL and Its Effect on Concurrency {#q2}

```
**Answer:**
The Global Interpreter Lock (GIL) is a mutex that ensures only one thread executes Python bytecode at a time, even on multi-core processors. This simplifies memory management but restricts true parallelism in CPU-bound code. Consequently, multithreaded Python programs are effective for I/O-bound tasks (like web requests) but not for CPU-heavy tasks. For CPU-bound operations, multiprocessing (using separate processes) or external native modules are preferred to bypass GIL restrictions.
```

 

## 3. Multithreading vs. Multiprocessing in Python {#q3}

```
**Answer:**

- **Multithreading:** Runs multiple threads within a single process. Threads share memory; suitable for I/O-bound tasks but limited by GIL for CPU-bound work.
- **Multiprocessing:** Launches separate processes, each with its own Python interpreter and memory space, achieving real parallelism. Best for CPU-bound tasks as it sidesteps the GIL.
```

 

## 4. Memory Management in Python {#q4}

```
**Answer:**
Python uses automatic memory management via reference counting and a cyclic garbage collector. Every object tracks references, and when its count drops to zero, it’s deallocated. For reference cycles, Python’s GC periodically detects and frees unreachable objects. Developers can influence memory use by deleting references, using weak references, or manually invoking garbage collection through the `gc` module.
```

 

## 5. Python’s Core Data Structures and When to Use Them {#q5}

```
**Answer:**

- **List:** Ordered, mutable, allows duplicates. Use for dynamic collections needing frequent item changes.
- **Tuple:** Ordered, immutable, allows duplicates. Good for fixed data, as dict keys, or for safe iteration.
- **Dict:** Unordered (Python 3.6+ insertion ordered), mutable key-value pairs. Ideal for lookups and mappings.
- **Set:** Unordered, mutable, unique items. Use for membership checks, removing duplicates, set algebra.
```

 

## 6. Decorators: Implementation and Use in Web Apps {#q6}

```
**Answer:**
Decorators are higher-order functions that add functionality before/after a function runs by wrapping it. They’re defined using the `@decorator` syntax. In web applications, decorators are commonly used for authentication checks, logging, input validation, caching, or managing database transactions (e.g., `@login_required` in Flask/Django).
```

 

## 7. @staticmethod, @classmethod, and Instance Methods {#q7}

```
**Answer:**

- **Instance method:** Receives `self`, works with object state.
- **@staticmethod:** No `self` or `cls`. Utility function bound to a class. Called on class or instance.
- **@classmethod:** Receives `cls`, can alter class state, and is useful for alternative constructors.
```

 

## 8. Exception Handling, raise vs assert {#q8}

```
**Answer:**

- **Exception Handling:** Uses try-except blocks to catch and manage errors.
- **raise:** Explicitly triggers an exception, for error propagation or custom errors.
- **assert:** Used to verify assumptions; raises `AssertionError` if condition fails. Typically disabled in optimized mode and meant for debugging, not runtime checks.
```

 

## 9. Context Managers (with statement) and Internal Working {#q9}

```
**Answer:**
Context managers simplify resource management (open files, lock acquisition). The `with` statement uses objects implementing `__enter__` and `__exit__` methods to set up and clean up resources safely, even if exceptions occur. Custom context managers can be written using classes or generator functions (with `contextlib.contextmanager`).
```

 

## 10. Optimizing Python Web Application Performance {#q10}

```
**Answer:**

- Use efficient algorithms and data structures.
- Profile code (cProfile, line_profiler) to identify bottlenecks.
- Enable caching (in-memory, Redis/Memcached, HTTP cache).
- Optimize database queries (ORM optimization, indexing, connection pooling).
- Run heavy/async work off the main thread or process (Celery, asyncio).
- Leverage C extensions for hot paths.
- Use just-in-time compilation (PyPy) or concurrency/multiprocessing as applicable.
```

 

## 11. Shallow Copy vs Deep Copy {#q11}

```
**Answer:**

- **Shallow copy:** Copies a container but not nested objects (uses references).
- **Deep copy:** Copies container and all nested objects recursively.
- Use the `copy` module—`copy.copy()` for shallow, `copy.deepcopy()` for full duplication.
```

 

## 12. Asynchronous Programming (async/await) {#q12}

```
**Answer:**
Python’s `asyncio` library introduces `async def` (coroutines) and `await` for non-blocking I/O. Async code allows a single-threaded program to handle many concurrent tasks (like network calls) by yielding control during waits, leading to scalable, event-driven apps—essential for web servers, bot frameworks, and pipelines.
```

 

## 13. Generators and Iterators {#q13}

```
**Answer:**

- **Iterators:** Objects implementing `__iter__` and `__next__`, used in for-loops.
- **Generators:** Special iterators made with functions using `yield`, which produce items one at a time, pausing state between calls. Useful for lazy evaluation, streaming data, or pipelining transformations.
```

 

## 14. Garbage Collector and Managing Memory Leaks {#q14}

```
**Answer:**
Python’s garbage collector handles cyclical references through the `gc` module. Developers can reduce leaks by:

- Avoiding lingering references to large objects.
- Using context managers for timely resource cleanup.
- Profiling memory use (`objgraph`, `tracemalloc`).
- Explicitly executing `gc.collect()` if needed.
```

 

## 15. __slots__ and Their Use Cases {#q15}

```
**Answer:**
`__slots__` restricts instance attributes to a predefined set, saving memory by eliminating the dynamic `__dict__` for each object. Use in high-volume classes with many instances, such as ORM models or event objects, for efficiency.
```

 

## 16. Type Hinting in Large Applications {#q16}

```
**Answer:**
Type hints (PEP 484) use syntax like `def func(a: int) -> str:` to annotate function signatures, classes, and variables. They facilitate static analysis and better IDE completion, reduce bugs, and improve code readability and refactoring for large codebases.
```

 

## 17. is vs == in Python {#q17}

```
**Answer:**

- **is:** Checks identity (whether two references point to the same object in memory).
- **==:** Checks value equality (content).
- They may match for small integers or interned strings but are semantically different.
```

 

## 18. Structuring Modules and Packages in Scalable Projects {#q18}

```
**Answer:**
Large Python projects use a **package** (directory with `__init__.py`) per major feature or bounded context.

- Core business logic, storage, APIs, utils, and config are separated.
- Absolute imports preferred, cyclic imports avoided.
- Use virtual environments, manage dependencies with `requirements.txt` or `pyproject.toml`.
```

 

## 19. Security Concerns and Mitigation in Python Applications {#q19}

```
**Answer:**
Common security issues:

- Injection attacks (SQL, XSS): Use parameterized queries and escaping.
- Insecure deserialization: Avoid pickle/untrusted input.
- Credential leaks: Store secrets outside code (env vars, Vault).
- Inadequate input validation: Always validate, especially on web boundaries.
- Mitigate by using well-maintained libraries, keeping dependencies updated, reviewing code, and applying least privilege principles.
```

 

## 20. Testing and Debugging (unittest/pytest, pdb) {#q20}

```
**Answer:**

- **Testing:** Use `unittest` (standard) or `pytest` for advanced features, fixtures, and scalable test discovery.
- **Debugging:** Integrate breakpoints using `pdb` (Python Debugger) or IDE built-in debuggers.
- Automate with CI tools and set up coverage reporting for code quality.
```

These answers will comprehensively prepare candidates for backend Python interviews with clarity and technical depth.
