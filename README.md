Social Distancing Calculator
===========================

## Dependencies
 - Node.js (12+)
 - Postgres/MySQL/SQL Server
 - Redis

## Installation
### 1. Clone repository
````
git@github.com:reediculous456/SocialDistancingCalculator.git
````

### 2. Create configuration file in the config folder
  - The name needs to match the Envirnoment variable `NODE_ENV`
  - Only override the properties different from the provided `default.json` file.

### 3. Install Node dependencies
````
npm install
````

### 4. Build Front End
Development mode
```
npm run build-dev
```

Production mode
```
npm run build
```

### 5. Start application ([PM2](https://github.com/Unitech/pm2) recommended for running in background)

Development mode
````
npm run dev
````

Production mode
````
npm start
````
