import React from "react";
import { Card, CardContent, Typography, Grid, List, ListItem, ListItemText } from "@mui/material";

const ResearchStatsMap = ({ catchData }) => {
  

  const calculateTotalCatchWeight = () => {
    // Sum up weights from all 'species' within each catch
    return catchData.reduce((total, data) => {
      const catchWeight = data.catches.reduce((subTotal, singleCatch) => {
        if (!singleCatch || !singleCatch.species) {
          console.warn("Missing species data in catch:", singleCatch);
          return subTotal; // Skip if species data is missing
        }
  
        const speciesWeight = singleCatch.species.reduce((speciesTotal, species) => {
          return speciesTotal + (species.catch_weight || 0); // Add species weight
        }, 0);
  
        return subTotal + speciesWeight;
      }, 0);
  
      return total + catchWeight;
    }, 0);
  };
  
  
  
  

  const calculateAverageDepth = () => {
    const allDepths = catchData.flatMap((data) =>
      data.catches.map((catchDetail) => catchDetail.depth)
    );
    const totalDepth = allDepths.reduce((total, depth) => total + depth, 0);
    return (totalDepth / allDepths.length).toFixed(2);
  };

  const calculateSpeciesCounts = () => {
    const speciesMap = new Map();
    catchData.forEach((data) => {
      data.catches.forEach((catchDetail) => {
        catchDetail.species.forEach((s) => {
          speciesMap.set(
            s.name,
            (speciesMap.get(s.name) || 0) + s.catch_weight
          );
        });
      });
    });
    return Array.from(speciesMap.entries());
  };

  // Calculated stats
  const totalCatchWeight = calculateTotalCatchWeight();
  const averageDepth = calculateAverageDepth();
  const speciesCounts = calculateSpeciesCounts();

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Research Stats
      </Typography>
      <Grid container spacing={3}>
        {/* Total Catch Weight */}
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Catch Weight
              </Typography>
              <Typography variant="h4" color="primary">
                {totalCatchWeight} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Depth */}
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Average Depth
              </Typography>
              <Typography variant="h4" color="primary">
                {averageDepth} meters
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Species Counts */}
        <Grid item xs={12} sm={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Species Counts
              </Typography>
              <List>
                {speciesCounts.map(([species, weight]) => (
                  <ListItem key={species} disablePadding>
                    <ListItemText primary={`${species}: ${weight} kg`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResearchStatsMap;
