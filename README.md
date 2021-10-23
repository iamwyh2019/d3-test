# d3-test

I created this project at 1:00pm Oct. 23, but did not began really writing it till 18:00pm. It took roughly 4 hours to complete the entire project + record a brief video (see commit log).

![image-20211023223050256](C:\Users\ReCOR\AppData\Roaming\Typora\typora-user-images\image-20211023223050256.png)

## Details

I used d3 library and did not use any frameworks. `main.js` handles all the drawing and animations, and `params.js` defines some constants (like bar width, gap width, etc).

I used two fonts: Balto and Harriet. Both are used by Vox news and downloaded from the internet.

I referred to [this link](https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an) to export an svg. This part of the code is not included in the project. All other parts are original.

I used d3-transition for animation. The animation speed function is a sigmoid-like function that is slow at beginning & end and fast in the middle. I got it by changing coefficients and plotting graphs on Wolfram Alpha.