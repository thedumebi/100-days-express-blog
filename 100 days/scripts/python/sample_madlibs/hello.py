def madlib():
    name = input("Enter your name: ")
    age = input("Enter your age: ")
    location = input("Enter your location: ")
    occupation = input("Enter your occupation: ")
    hobby1 = input("Enter a hobby: ")
    hobby2 = input("Enter another hobby: ")
    hobby3 = input("Enter another hobby: ")
    favourite_artist = input("Enter your favorite musician: ")
    nickname = input("What is your nickname? ")
    superhero = input("favorite superhero: ")

    madlib = f"Hello!, my name is {name}, I am {age} years old. I live in {location} and I am a/an \
    {occupation}. It is nice to meet you. My hobbies include {hobby1}, {hobby2} and {hobby3}. \
    I also like listening to music and my favorite artiste \
    is {favourite_artist}. My nickname is {nickname} and my favourite superhero is {superhero}"

    print(madlib)