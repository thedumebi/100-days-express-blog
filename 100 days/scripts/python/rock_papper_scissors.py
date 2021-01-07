import random

def play():
    user = input("What's your choice? 'r' for rock, 'p' for paper, 's' for scissors\n").lower()
    computer = random.choice(["r", "p", "s"])
    print(f"computer's choice is {computer}")

    if user == computer:
        return 'It\'s a tie'

    if user_win(user, computer):
        return "You won!"
    
    return "You lost!"

    # r > s, s > p, p > r

def user_win(player, opponent):
    #return true if player wins
    # r > s, s > p, p > r
    if (player == "r" and opponent =="s") or (player == "s" and opponent == "p") \
    or (player == "p" and opponent == "r"):
        return True

print(play())