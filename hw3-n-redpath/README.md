# Homework 3

This homework is intended to give you more exposure to sentiment analysis and dealing with raw data via the Twitter API.

A few instructions:

1. For this assignment, we will be using data from Twitter. In order to do so, we will need to create a developer account on Twitter at https://developer.twitter.com/en. If you have an existing Twitter account, you can use that as well.
2. Next, click on "Dashboard" and open "Projects and Apps". Fill out the forms to the best of your ability (not all information is necessary). You will need to provide a phone number.
3. Finally, once approved, click on "Keys and Tokens" and you will find your API keys and access tokens.
4. Make sure to clone this repo to your computer.
5. You will need the data files containing positive and negative words to perform your sentiment analysis. This can be found in positive-words.txt and negative-words.txt files from Lab3's data folder. Make sure to save the content of the zip file to "/utility/data"
6. Then activate the Conda environment before starting the jupyter notebook
7. In your terminal, run the following commands:
  ```console
    conda activate cse217a
    jupyter notebook
  ```

When you're ready to commit and push:
1. Open terminal and navigate to the repo
2. Run the following commands:
  ```console
    git commit hw3*.ipynb -m "message"
    git pull
  ```
3. Make sure there aren't any merge conflicts. If there are any, resolve them using a code editor.
4. Finally, run the following command to push your changes:
  ```console
    git push
  ```
