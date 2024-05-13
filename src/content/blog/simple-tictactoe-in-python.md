---
title: Simple TicTacToe in Python
description: 'TicTacToe is a pretty simple game to play, and also to create in code, this blog will cover how you can make a simple tictactoe game in python.'
pubDate: 'May 13 2024'
heroImage: '/blog-images/simple-tictactoe-in-python.webp'
---

TicTacToe is a pretty simple game to play, and also to create in code, this blog will cover how you can make a simple tictactoe game in python. All you need is python itself.
We'll be making a command line app

## Project Setup

First Things first we need to setup the project, there's not a lot of code involved in this

```python
board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
player_no = 0

def main():
    pass

main()
```
\
Here we're initiating the board to be empty and the player(currently playing) to be 0.
Next, we need a function to draw the board

```python
def main():
    draw_board()

def draw_board():
    for i, e in enumerate(board):
        if (i + 1) == 2 or (i + 1) == 5 or (i + 1) == 8:
            print("|" + e, end="|")
        else:
            print(e, end="")

        # print a line after every 3 character
        if (i + 1) != 1 and ((i + 1) % 3 == 0):
            print()
```
\
If we run the code we'll see a similar output

```sh
 | |
 | |
 | |
```

Next we'll make a function to get the input from the user. I've done some error handling for making sure that the user types in the desired inputs

```python
def get_input():
    global player_no # To make sure we're not creating the variable
    while True:
        try:
            if get_player() == 0:
                 print("Current player is O")
            else:
                print("The current player is X")
            n = int(input("Pick a number between 1 and 9: "))

            # Check for invalid numbers
            if n > 9 or n <= 0:
                pass
            # Check if the position is already marked by a player
            elif board[n - 1] == "X" or board[n-1] == "O":
                pass
            else:
                player_no = player_no + 1
                return n - 1
        except ValueError:
            print("Common man you're not even trying")
```
\
Here I'm defining a helper function to the current player and also defining the check winner function
The check_winner function checks, the diagonals and the checks each row and column if there is a winner, it also resets the board if the board is full

```python
def get_player():
    if player_no % 2 == 0:
        return 0
    else:
        return 1


def check_winner():
    # check diagonal
    if board[2] == board[2 + 2] == board[2 + 2 + 2]:
        return board[2]
    elif board[0] == board[2 + 2] == board[8]:
        return board[0]

    # check every row
    for i, e in enumerate(board):
        if (i + 1) % 3 == 0 and (i + 1) != 1:
            if e == board[i-2] == board[i-1]:
                return e

    # Check vertical
    for i in range(3):
        if board[i] == board[i + 3] == board[i + 6]:
            return board[i]

    # Check if board is full
    if " " not in board:
        for i in range(9):
            board[i] = " "

    return "Not Found"
```

We can now head back to our main function and implement our functions

```python
def main():
    draw_board()
    input = get_input()

    while True:
        if get_player() == 0:
            board[input] = "X"
        else:
            board[input] = "O"

        winner = check_winner()
        if winner == "O":
            draw_board()
            print("O is the winner")
            return
        elif winner == "X":
            draw_board()
            print("X is the winner")
            return
        else:
            pass

        draw_board()
        input = get_input()
```
\
Here we have a while loop that runs until a winner is found

Yeah, that's it, pretty easy maybe too easy, You can modify the code to make something more interesting.

