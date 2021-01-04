def madlib():
    person = input("person: ")
    adjective1 = input("adjective: ")
    adjective2 = input("adjective: ")
    noun1 = input("noun: ")
    adjective3 = input("adjective: ")
    noun2 = input("noun: ")
    adjective4 = input("adjective: ")
    verb1 = input("verb: ")
    verb2 = input("verb: ")
    verb3 = input("verb: ")

    madlib = f"Yesterday, {person} and I went to the park, On our way to the {adjective1} park, we saw a {adjective2} \
    {noun1} on a bike. We also saw big {adjective3} balloons tied to a {noun2}. Once we got to the {adjective1} park, \
    the sky turned {adjective4}. It started to {verb1} and {verb2} {person} and I {verb3} all the way home. \
    Tomorrow we will try to go to the {adjective1} park again and hope it doesn't {verb1}"

    print(madlib)