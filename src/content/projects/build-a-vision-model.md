---
title: Build a Vision Model
order: 60
lessons: 38
size: Medium
tech:
  - Convolution
  - CNN
  - Backpropagation
estMin: 20
desc: 'Teach a computer to see: convolution, a CNN forward pass, and backprop derived by hand.'
blurb: 'One operation - slide a small grid over an image and multiply - gives you blur, edge detection, and the convolutional network. Build all three, and derive every backward pass yourself rather than letting a framework hide it.'
overview: |
  Convolution is the whole subject. Slide a small grid of numbers over an image,
  multiply and sum, and depending on the numbers in that grid you get a blur, an
  edge detector, or a learned feature. This project follows that one operation
  from classical image processing all the way to a convolutional network that
  classifies images.

  You will start with pixels and PGM files, then build convolution and use it
  the classical way: blurring, Gaussian kernels, Sobel gradients, thresholding.
  Then the same operation with learnable weights - conv2d, ReLU, pooling, dense
  layers and softmax - assembled into a network whose forward pass you can trace
  by hand. Then the part frameworks hide: every backward pass, derived yourself.
  The combined softmax and cross-entropy gradient, dense backward, pooling that
  routes gradient to the value that won, and convolution backward - checked
  against numerical gradients so you know they are right.

  The finished network is small and honest about it: it tells vertical edges
  from horizontal ones, on tiny images your own code generates from a formula,
  and it runs in under a second on one CPU core. It is not pointed at
  photographs. The point is not the accuracy - it is that there is no framework
  anywhere in it, every gradient is one you derived, and a numerical check
  proves they are right to eleven decimal places.
parts:
  - name: Images
    count: 5
  - name: Classical vision
    count: 8
  - name: Layers
    count: 8
  - name: Backprop by hand
    count: 7
  - name: Training
    count: 6
  - name: The capstone
    count: 4
caveats:
  note: 'The two-class edge-detection network and both demo programs work end to end with hand-derived backprop, but the whole pipeline runs on a fixed nine-image formula-generated dataset - there is no way to point it at real images.'
  future:
    - Render the training and held-out images as ASCII or tiny PGMs so vertical-versus-horizontal is something you can see rather than a number you are told
    - Generate more held-out samples at other positions and classes, and find out whether the 74% generalization result holds beyond a single example
    - Add a shuffled or minibatched variant of the training loop alongside the full-batch one
    - Add momentum on top of the plain SGD step
    - Try a larger, less trivially separable dataset - more samples, more classes - and see whether 100% accuracy survives it
    - Load a real image and run the classical pipeline over it, rather than only the generated test pattern
resources:
  - title: 'Gradient-based learning applied to document recognition'
    author: Yann LeCun et al.
    url: http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf
    note: The LeNet paper. The architecture this project builds a small version of.
  - title: Deep Learning
    author: Ian Goodfellow, Yoshua Bengio, Aaron Courville
    url: https://www.deeplearningbook.org/
    note: Chapter 9 is the definitive treatment of convolutional networks.
  - title: 'Computer Vision: Algorithms and Applications'
    author: Richard Szeliski
    url: https://szeliski.org/Book/
    note: Free, and the reference for the classical half of this project.
  - title: 'CS231n: Convolutional Neural Networks for Visual Recognition'
    author: Stanford
    url: https://cs231n.github.io/
    note: The notes on backpropagation through conv and pooling layers are excellent.
  - title: Digital Image Processing
    author: Rafael Gonzalez, Richard Woods
    note: The classical text on filtering, edges and morphology.
---
