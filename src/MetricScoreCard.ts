interface MetricScoreCard {
    metricName: string;
    score: number;
    description: string;
}

const myMetricScoreCard: MetricScoreCard = {
    metricName: "Example Metric",
    score: 10,
    description: "This is an example metric score card."
};

// Usage example
console.log(myMetricScoreCard.metricName); // Output: "Example Metric"
console.log(myMetricScoreCard.score); // Output: 10
console.log(myMetricScoreCard.description); // Output: "This is an example metric score card."