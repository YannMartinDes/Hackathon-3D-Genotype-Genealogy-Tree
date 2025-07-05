# 3D Genotype Genealogy Tree

This project visualizes the genealogy of genotypes in a 3D space using react-three (three.js).   

This project has been developed during a corporate hackathon at the company Doriane SAS.

It allows users to explore the relationships between different genotypes, their parents and children in an interactive 3D environment.

The dataset (~6000 genotypes) used in this project is a sample dataset of genotypes, which can be replaced with any other dataset in the same format. It comes from example dataset of the company Doriane SAS.   
*NOTE: The dataset is complex so the relation in the genealogy tree is not always clear.*

## How to run the project
To install the project, you need to have Node.js and Yarn installed on your machine.  
 *Node version used v22.17.0*

To install the dependencies, run the following command: `yarn`

To run the project, use the following command: `yarn dev`

To run the project in production mode, use the following command: `npm run build` then `npx serve -s .\dist\`