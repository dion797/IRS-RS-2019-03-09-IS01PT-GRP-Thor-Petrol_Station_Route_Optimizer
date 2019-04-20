import numpy as np, random, operator, pandas as pd, matplotlib.pyplot as plt
import math as math
import time
import constants


class Loc:

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance(self, loc):
        if((self.x==constants.startx)and(self.y==constants.starty)and(loc.x==10000)):
            dist=0
            return dist
        if((loc.x==constants.startx)and(loc.y==constants.starty)and(self.x==10000)):
            dist=0
            return dist
        if((self.x==constants.endx)and(self.y==constants.endy)and(loc.y==10000)):
            dist=0
            return dist
        if((loc.x==constants.endx)and(loc.y==constants.endy)and(self.y==10000)):
            dist=0
            return dist
        radlat1 = math.pi * self.x/180
        radlat2 = math.pi * loc.x/180
        theta = self.y-loc.y
        radtheta = math.pi * theta/180
        dist = math.sin(radlat1) * math.sin(radlat2) + math.cos(radlat1) * math.cos(radlat2) * math.cos(radtheta)
        if (dist > 1):
            dist = 1
        
        dist = math.acos(dist)
        dist = dist * 180/math.pi
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344

        return dist
    
       
    def __repr__(self):
        return "(" + str(self.x) + "," + str(self.y) + ")"



class Fitness:
    def __init__(self, route):
        self.route = route
        self.distance = 0
        self.fitness= 0.0
    
    def routeDistance(self):
        if self.distance ==0:
            pathDistance = 0
            for i in range(0, len(self.route)):
                fromLoc = self.route[i]
                toLoc = None
                if i + 1 < len(self.route):
                    toLoc = self.route[i + 1]
                else:
                    toLoc = self.route[0]
                pathDistance += fromLoc.distance(toLoc)
            self.distance = pathDistance
        return self.distance
    
    def routeFitness(self):
        if self.fitness == 0:
            self.fitness = 1 / float(self.routeDistance())
        return self.fitness


# In[485]:


def createRoute(locList):
    stime=time.time()
    route = random.sample(locList, len(locList))
    etime=time.time()
#    print (" time to createRoute is " + str(etime-stime))
    return route


# In[486]:


def initialPopulation(popSize, locList):
    population = []
    stime=time.time()
    for i in range(0, popSize):
        population.append(createRoute(locList))
    etime=time.time()
#    print (" time to initialPopulation is " + str(etime-stime))
    return population


# In[487]:


def rankRoutes(population):
    fitnessResults = {}
    stime=time.time()
    for i in range(0,len(population)):
        fitnessResults[i] = Fitness(population[i]).routeFitness()
    etime=time.time()
#    print (" time to rankRoutes is " + str(etime-stime))
    return sorted(fitnessResults.items(), key = operator.itemgetter(1), reverse = True)


# In[488]:


def selection(popRanked, eliteSize):
    selectionResults = []
    stime=time.time()
    df = pd.DataFrame(np.array(popRanked), columns=["Index","Fitness"])
    df['cum_sum'] = df.Fitness.cumsum()
    df['cum_perc'] = 100*df.cum_sum/df.Fitness.sum()
    
    for i in range(0, eliteSize):
        selectionResults.append(popRanked[i][0])
    for i in range(0, len(popRanked) - eliteSize):
        pick = 100*random.random()
        for i in range(0, len(popRanked)):
            if pick <= df.iat[i,3]:
                selectionResults.append(popRanked[i][0])
                break
    etime=time.time()
#    print (" time to selection is " + str(etime-stime))
    return selectionResults


# In[489]:


def matingPool(population, selectionResults):
    stime=time.time()
    matingpool = []
    for i in range(0, len(selectionResults)):
        index = selectionResults[i]
        matingpool.append(population[index])
    etime=time.time()
#    print (" time to matingPool is " + str(etime-stime))
    return matingpool


# In[490]:


def breed(parent1, parent2):
    
    child = []
    childP1 = []
    childP2 = []
    
    geneA = int(random.random() * len(parent1))
    geneB = int(random.random() * len(parent1))
    
    startGene = min(geneA, geneB)
    endGene = max(geneA, geneB)

    for i in range(startGene, endGene):
        childP1.append(parent1[i])
        
    childP2 = [item for item in parent2 if item not in childP1]

    child = childP1 + childP2
    
    
    return child


# In[491]:


def breedPopulation(matingpool, eliteSize):
    stime=time.time()
    children = []
    length = len(matingpool) - eliteSize
    pool = random.sample(matingpool, len(matingpool))

    for i in range(0,eliteSize):
        children.append(matingpool[i])
    
    for i in range(0, length):
        child = breed(pool[i], pool[len(matingpool)-i-1])
        children.append(child)
    etime=time.time()
#    print (" time to breedPopulation is " + str(etime-stime))
    return children


# In[492]:


def mutate(individual, mutationRate):
    for swapped in range(len(individual)):
        if(random.random() < mutationRate):
            swapWith = int(random.random() * len(individual))
            
            loc1 = individual[swapped]
            loc2 = individual[swapWith]
            
            individual[swapped] = loc2
            individual[swapWith] = loc1
    return individual


# In[493]:


def mutatePopulation(population, mutationRate):
    stime=time.time()
    mutatedPop = []
    
    for ind in range(0, len(population)):
        mutatedInd = mutate(population[ind], mutationRate)
        mutatedPop.append(mutatedInd)
    etime=time.time()
#    print (" time to mutatePopulation is " + str(etime-stime))
    return mutatedPop


# In[494]:


def nextGeneration(currentGen, eliteSize, mutationRate):
    stime=time.time()
    popRanked = rankRoutes(currentGen)
    selectionResults = selection(popRanked, eliteSize)
    matingpool = matingPool(currentGen, selectionResults)
    children = breedPopulation(matingpool, eliteSize)
    nextGeneration = mutatePopulation(children, mutationRate)
    etime=time.time()
#    print (" time to nextGeneration is " + str(etime-stime))
    return nextGeneration


# In[495]:


# In[496]:


# this cleans the final result by removing the link node 

# and making path from start point to end point

def clean_list(list):
    ret_list=[]
    rev_list=[]
    start_loc=0
    end_loc=0
#    start_loc=list.index([startx, starty])
#    end_loc=list.index([endx, endy])
    
    for i in range(0, len(list)):
        if ((list[i].x==constants.endx) and (list[i].y==constants.endy)):
            end_loc=i
            
        if ((list[i].x==constants.startx) and (list[i].y==constants.starty)):
            start_loc=i
        
        if (list[i].x==10000):    
            link_loc=i
#    print ("startloc is " + str(start_loc) + " endloc is " + str(end_loc) + " linkloc is " + str(link_loc))
#    print ("length of list is " + str(len(list)))
    
    if ((link_loc == 0)): # link location is top of the list
        if (start_loc<end_loc):
            for i in range(start_loc, len(list)):
                ret_list.append(list[i])
#                print ("appended " + str(list[i]) + " to ret_list for i =" + str(i))
            return(ret_list)
        if (start_loc>end_loc):
            for i in range(end_loc, len(list)):
                ret_list.append(list[i])
#                print ("appended " + str(list[i]) + " to ret_list for i =" + str(i))
            for i in range(0, len(ret_list)):
                rev_list.append(ret_list[len(ret_list)-i-1])
#                print ("reversing the list") 
            ret_list=rev_list
            return(ret_list)

    if (link_loc==len(list)-1): # link location is bottom of the list
        if (start_loc<end_loc):
            for i in range(start_loc, len(list)-1):
                ret_list.append(list[i])
#                print ("appended " + str(list[i]) + " to ret_list for i =" + str(i))
            return(ret_list)
        if (start_loc>end_loc):
            for i in range(end_loc, len(list)-1):
                ret_list.append(list[i])
 #               print ("appended " + str(list[i]) + " to ret_list for i =" + str(i))
            for i in range(0, len(ret_list)):
                rev_list.append(ret_list[len(ret_list)-i-1])
#                print ("reversing the list") 
            ret_list=rev_list
            return(ret_list)        
        
            
    
    if(start_loc>end_loc):  # add in ascending order of locations
        
        for i in range(0, len(list)):
            if ((list[i].x==constants.startx) and (list[i].y==constants.starty)):
         
                for j in range(0, len(list)-i):
                    if((list[i+j].x != constants.Linkloc[0]) and (list[i+j].x != constants.Linkloc[1])):
                        ret_list.append(list[i+j])
                for j in range (len(list)-i, len(list)-1):
              
                    if((list[i+j-len(list)].x != constants.Linkloc[0]) and (list[i+j-len(list)].x != constants.Linkloc[1])):
                        ret_list.append(list[i+j-len(list)])
        return (ret_list)

    if(start_loc<end_loc):  # add in descending order of locations
        
        for i in range(0, len(list)):
            if ((list[i].x==constants.endx) and (list[i].y==constants.endy)):
                for j in range(0, len(list)-i):
                    if((list[i+j].x != constants.Linkloc[0]) and (list[i+j].x != constants.Linkloc[1])):
                        ret_list.append(list[i+j])
#                        print ("appended " + str(list[i+j]) + " to ret_list for i and j " + str(i) +"  " + str(j))

                for j in range (len(list)-i, len(list)-1):
               
                    if((list[i+j-len(list)].x != constants.Linkloc[0]) and (list[i+j-len(list)].x != constants.Linkloc[1])):
                        ret_list.append(list[i+j-len(list)])
#                        print ("appended " + str(list[i+j-len(list)]) + " to ret_list for i and j " + str(i) +"  " + str(j))
        for i in range(0, len(ret_list)):
            rev_list.append(ret_list[len(ret_list)-i-1])
#            print ("reversing the list")                   
            
        ret_list=rev_list
        return(ret_list)

        
        
        



    




