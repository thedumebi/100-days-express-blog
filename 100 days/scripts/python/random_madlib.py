from sample_madlibs import hello, park, party, madlibs
import random

if __name__ == "__main__":
    m = random.choice([hello, park, party, madlibs])
    m.madlib()