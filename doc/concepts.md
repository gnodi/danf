Understand the Concepts
=======================

[←](index.md)

Object-Oriented Programming (OOP)
---------------------------------

This part is going to be short. OOP is a way to develop big and complex applications for a long time now. Most commonly used languages are designed for that. Theoretical and empirical ways of coding with OOP are mature and allow to structure and develop robust applications.

However, native javascript does not provide all features you need to make a powerful OOP code. Danf implements an OOP layer allowing to handle that problematic.

Service Oriented Architecture (SOA)
-----------------------------------

SOA is often thought at a webservice level but is also the base of a strong factored OOP code.

Let's see an example of a pure OOP code where you want to sell a product in a store to a customer:
```javascript
var store = new Store(),
	product = new Product(),
	customer = new Customer()
;

// A first possibility.
store->sell(product, customer);

// A second possibility.
product->buy(store, customer);

// ...
```

This almost automatically leads to have duplicated codes very hard to maintain:
* You have to test each code.
* If one code evolves, you must not forget the other one.

Of course, you can try to only have one implemented method. But where? In `Product`? `Store`? `Customer`? And how to be sure it is implemented only once?

A better way, to handle that is to use a "service" (SOA pattern):
```javascript
var store = new Store(),
	product = new Product(),
	customer = new Customer(),
	saleHandler = new SaleHandler()
;

saleHandler->sell(product, store, customer);
```
The handler `saleHandler` is a service which is responsible for sales. He has the intelligence to manipulate data objects like `store`, `product` or `customer`.
This way, your code is factored and your developement is rationalized.

Composition and low coupling
----------------------------

### Composition vs inheritance

Lots of developers use inheritance to factorize code between classes. Of course it is not a bad idea, but it should be used in a strict delimited way. Multiple inheritance has many problems (diamond, complexity, ...) which often lead to a code difficult to maintain. In Danf, single inheritance is the rule. The framework encourages to use inheritance only when the parent and the child class have the same responsability.

Let's keep the previous example. Imagine, there are 3 sale entities in the company (clothing, perfume, jewel). This results in 3 `SaleHandler` child classes defining a method `getAfterSalesServicePhone()`. Child classes are sale handlers as their parent, so inheritance is fine. Now, imagine we want to log sales. Is it a good idea to make an abtract loggable class and make our child classes inherit from it? The response is obviously no! The way to handle it is simple:
```javascript
var clothingSaleHandler = new ClothingSaleHandler(),
	perfumeSaleHandler = new PerfumeSaleHandler(),
	jewelSaleHandler = new JewelSaleHandler(),
	logger = new Logger()
;

clothingSaleHandler->setLogger(logger);
perfumeSaleHandler->setLogger(logger);
jewelSaleHandler->setLogger(logger);
```

The responsability of a sale handler is not to log or be loggable but to handle sales. This is why composition must be used instead of inheritance. Here, the logging factored code is in the class `Logger`.

### Low coupling

Coupling is the degree of interaction between two classes. In an inheritance relation, the coupling is maximum: the child is fully dependent on its parent. This kind of coupling is really hard to change. In a simple composition relation, the coupling is the same as in an inheritance. However, it is possible to reduce this dependency by defining interfaces between classes.

Imagine, `Logger` has 30 methods. Sale handlers only need to call method `log()`. Then, a sale handler only need an object from a class implementing the interface `LoggerInterface` defining `log()`.

You can easily see the resulting benefits:
* Scalability: you can change the class `Logger` by another one implementing `LoggerInterface`.
* Maintenability: you can understand real dependencies between classes at a glance.
* Testability: you can mock dependencies just implementing the interfaces.

Danf allows to define and ensure interfaces to reduce coupling. This concept is important because it is the basis for using the dependency injection to its full potential and dependency injection is the basis for a strong OOP architecture. Dependency injection in Danf is explained in the next section.

Inversion of Control (IoC)
--------------------------

Danf handle the flow of control of your application for you. All you have to do is implement your classes and use the configuration to describe all the interactions.

A strong dependency injection component allows you to declare services from your classes and then inject them into each others. If you are coming from the PHP community, you will notice some similarity with the dependency injection of Symfony2.

Event driven
------------

This framework does not forget the spirit of javascript and Node: events drive the flow. In Danf, you will be able to handle all incoming events the same way. For instance, a HTTP request event will be handled as a click on an element in the browser.
Moreover, the way the events are handled gives a pretty easy alternative to callback hell.

[←](index.md)