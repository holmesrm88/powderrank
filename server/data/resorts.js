const resorts = [
  // Colorado
  { id: 'vail', name: 'Vail', city: 'Vail', state: 'CO', country: 'US', latitude: 39.6403, longitude: -106.3742, baseElevation: 8120, summitElevation: 11570, region: 'Colorado', ikonPass: false, epicPass: true },
  { id: 'breckenridge', name: 'Breckenridge', city: 'Breckenridge', state: 'CO', country: 'US', latitude: 39.4817, longitude: -106.0384, baseElevation: 9600, summitElevation: 12998, region: 'Colorado', ikonPass: false, epicPass: true },
  { id: 'keystone', name: 'Keystone', city: 'Keystone', state: 'CO', country: 'US', latitude: 39.6069, longitude: -105.9497, baseElevation: 9280, summitElevation: 12408, region: 'Colorado', ikonPass: false, epicPass: true },
  { id: 'copper', name: 'Copper Mountain', city: 'Frisco', state: 'CO', country: 'US', latitude: 39.5022, longitude: -106.1497, baseElevation: 9712, summitElevation: 12313, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'abasin', name: 'Arapahoe Basin', city: 'Keystone', state: 'CO', country: 'US', latitude: 39.6426, longitude: -105.8718, baseElevation: 10780, summitElevation: 13050, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'winterpark', name: 'Winter Park', city: 'Winter Park', state: 'CO', country: 'US', latitude: 39.8868, longitude: -105.7625, baseElevation: 9000, summitElevation: 12060, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'steamboat', name: 'Steamboat', city: 'Steamboat Springs', state: 'CO', country: 'US', latitude: 40.4572, longitude: -106.8045, baseElevation: 6900, summitElevation: 10568, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'aspen', name: 'Aspen Mountain', city: 'Aspen', state: 'CO', country: 'US', latitude: 39.1869, longitude: -106.8182, baseElevation: 7945, summitElevation: 11212, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'snowmass', name: 'Snowmass', city: 'Snowmass Village', state: 'CO', country: 'US', latitude: 39.2084, longitude: -106.9490, baseElevation: 8104, summitElevation: 12510, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'telluride', name: 'Telluride', city: 'Telluride', state: 'CO', country: 'US', latitude: 37.9375, longitude: -107.8123, baseElevation: 8725, summitElevation: 13150, region: 'Colorado', ikonPass: false, epicPass: false },
  { id: 'crested-butte', name: 'Crested Butte', city: 'Crested Butte', state: 'CO', country: 'US', latitude: 38.8991, longitude: -106.9650, baseElevation: 9375, summitElevation: 12162, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'wolf-creek', name: 'Wolf Creek', city: 'Pagosa Springs', state: 'CO', country: 'US', latitude: 37.4697, longitude: -106.7934, baseElevation: 10300, summitElevation: 11904, region: 'Colorado', ikonPass: false, epicPass: false },
  { id: 'loveland', name: 'Loveland', city: 'Georgetown', state: 'CO', country: 'US', latitude: 39.6800, longitude: -105.8979, baseElevation: 10800, summitElevation: 13010, region: 'Colorado', ikonPass: false, epicPass: false },
  { id: 'monarch', name: 'Monarch Mountain', city: 'Salida', state: 'CO', country: 'US', latitude: 38.5125, longitude: -106.3322, baseElevation: 10790, summitElevation: 11952, region: 'Colorado', ikonPass: false, epicPass: false },
  { id: 'eldora', name: 'Eldora', city: 'Nederland', state: 'CO', country: 'US', latitude: 39.9372, longitude: -105.5828, baseElevation: 9200, summitElevation: 10800, region: 'Colorado', ikonPass: true, epicPass: false },
  { id: 'purgatory', name: 'Purgatory', city: 'Durango', state: 'CO', country: 'US', latitude: 37.6303, longitude: -107.8141, baseElevation: 8793, summitElevation: 10822, region: 'Colorado', ikonPass: false, epicPass: false },
  { id: 'beaver-creek', name: 'Beaver Creek', city: 'Avon', state: 'CO', country: 'US', latitude: 39.6037, longitude: -106.5159, baseElevation: 7400, summitElevation: 11440, region: 'Colorado', ikonPass: false, epicPass: true },

  // Utah
  { id: 'alta', name: 'Alta', city: 'Alta', state: 'UT', country: 'US', latitude: 40.5884, longitude: -111.6386, baseElevation: 8530, summitElevation: 10550, region: 'Utah', ikonPass: false, epicPass: false },
  { id: 'snowbird', name: 'Snowbird', city: 'Snowbird', state: 'UT', country: 'US', latitude: 40.5830, longitude: -111.6508, baseElevation: 7760, summitElevation: 11000, region: 'Utah', ikonPass: false, epicPass: false },
  { id: 'park-city', name: 'Park City', city: 'Park City', state: 'UT', country: 'US', latitude: 40.6514, longitude: -111.5080, baseElevation: 6900, summitElevation: 10026, region: 'Utah', ikonPass: false, epicPass: true },
  { id: 'deer-valley', name: 'Deer Valley', city: 'Park City', state: 'UT', country: 'US', latitude: 40.6374, longitude: -111.4783, baseElevation: 6570, summitElevation: 9570, region: 'Utah', ikonPass: true, epicPass: false },
  { id: 'brighton', name: 'Brighton', city: 'Brighton', state: 'UT', country: 'US', latitude: 40.5980, longitude: -111.5832, baseElevation: 8755, summitElevation: 10500, region: 'Utah', ikonPass: true, epicPass: false },
  { id: 'solitude', name: 'Solitude', city: 'Solitude', state: 'UT', country: 'US', latitude: 40.6199, longitude: -111.5919, baseElevation: 7988, summitElevation: 10035, region: 'Utah', ikonPass: true, epicPass: false },
  { id: 'snowbasin', name: 'Snowbasin', city: 'Huntsville', state: 'UT', country: 'US', latitude: 41.2160, longitude: -111.8569, baseElevation: 6391, summitElevation: 9350, region: 'Utah', ikonPass: true, epicPass: false },
  { id: 'powder-mountain', name: 'Powder Mountain', city: 'Eden', state: 'UT', country: 'US', latitude: 41.3789, longitude: -111.7803, baseElevation: 6900, summitElevation: 9422, region: 'Utah', ikonPass: false, epicPass: false },
  { id: 'brian-head', name: 'Brian Head', city: 'Brian Head', state: 'UT', country: 'US', latitude: 37.7022, longitude: -112.8498, baseElevation: 9600, summitElevation: 11307, region: 'Utah', ikonPass: false, epicPass: false },

  // Wyoming
  { id: 'jackson-hole', name: 'Jackson Hole', city: 'Teton Village', state: 'WY', country: 'US', latitude: 43.5877, longitude: -110.8279, baseElevation: 6311, summitElevation: 10450, region: 'Wyoming', ikonPass: true, epicPass: false },
  { id: 'grand-targhee', name: 'Grand Targhee', city: 'Alta', state: 'WY', country: 'US', latitude: 43.7902, longitude: -110.9581, baseElevation: 7851, summitElevation: 10230, region: 'Wyoming', ikonPass: false, epicPass: false },

  // Montana
  { id: 'big-sky', name: 'Big Sky', city: 'Big Sky', state: 'MT', country: 'US', latitude: 45.2838, longitude: -111.4013, baseElevation: 6800, summitElevation: 11166, region: 'Montana', ikonPass: true, epicPass: false },
  { id: 'whitefish', name: 'Whitefish Mountain', city: 'Whitefish', state: 'MT', country: 'US', latitude: 48.4816, longitude: -114.3538, baseElevation: 4464, summitElevation: 6817, region: 'Montana', ikonPass: true, epicPass: false },
  { id: 'bridger-bowl', name: 'Bridger Bowl', city: 'Bozeman', state: 'MT', country: 'US', latitude: 45.8171, longitude: -110.8963, baseElevation: 6100, summitElevation: 8800, region: 'Montana', ikonPass: false, epicPass: false },

  // Idaho
  { id: 'sun-valley', name: 'Sun Valley', city: 'Ketchum', state: 'ID', country: 'US', latitude: 43.6970, longitude: -114.3511, baseElevation: 5750, summitElevation: 9150, region: 'Idaho', ikonPass: false, epicPass: false },
  { id: 'schweitzer', name: 'Schweitzer', city: 'Sandpoint', state: 'ID', country: 'US', latitude: 48.3677, longitude: -116.6230, baseElevation: 4000, summitElevation: 6400, region: 'Idaho', ikonPass: true, epicPass: false },
  { id: 'bogus-basin', name: 'Bogus Basin', city: 'Boise', state: 'ID', country: 'US', latitude: 43.7649, longitude: -116.1028, baseElevation: 5800, summitElevation: 7582, region: 'Idaho', ikonPass: false, epicPass: false },
  { id: 'brundage', name: 'Brundage Mountain', city: 'McCall', state: 'ID', country: 'US', latitude: 44.8578, longitude: -116.1553, baseElevation: 5840, summitElevation: 7640, region: 'Idaho', ikonPass: false, epicPass: false },

  // California
  { id: 'mammoth', name: 'Mammoth Mountain', city: 'Mammoth Lakes', state: 'CA', country: 'US', latitude: 37.6308, longitude: -119.0326, baseElevation: 7953, summitElevation: 11053, region: 'California', ikonPass: true, epicPass: false },
  { id: 'squaw-valley', name: 'Palisades Tahoe', city: 'Olympic Valley', state: 'CA', country: 'US', latitude: 39.1968, longitude: -120.2354, baseElevation: 6200, summitElevation: 9050, region: 'California', ikonPass: true, epicPass: false },
  { id: 'kirkwood', name: 'Kirkwood', city: 'Kirkwood', state: 'CA', country: 'US', latitude: 38.6850, longitude: -120.0653, baseElevation: 7800, summitElevation: 9800, region: 'California', ikonPass: false, epicPass: true },
  { id: 'heavenly', name: 'Heavenly', city: 'South Lake Tahoe', state: 'CA', country: 'US', latitude: 38.9353, longitude: -119.9400, baseElevation: 6540, summitElevation: 10067, region: 'California', ikonPass: false, epicPass: true },
  { id: 'northstar', name: 'Northstar', city: 'Truckee', state: 'CA', country: 'US', latitude: 39.2746, longitude: -120.1210, baseElevation: 6330, summitElevation: 8610, region: 'California', ikonPass: false, epicPass: true },
  { id: 'sugar-bowl', name: 'Sugar Bowl', city: 'Norden', state: 'CA', country: 'US', latitude: 39.3047, longitude: -120.3361, baseElevation: 6883, summitElevation: 8383, region: 'California', ikonPass: false, epicPass: false },
  { id: 'mt-rose', name: 'Mt. Rose', city: 'Reno', state: 'NV', country: 'US', latitude: 39.3149, longitude: -119.8816, baseElevation: 7900, summitElevation: 9700, region: 'California', ikonPass: false, epicPass: false },
  { id: 'sierra-at-tahoe', name: 'Sierra at Tahoe', city: 'Twin Bridges', state: 'CA', country: 'US', latitude: 38.7996, longitude: -120.0800, baseElevation: 6640, summitElevation: 8852, region: 'California', ikonPass: false, epicPass: false },

  // Pacific Northwest
  { id: 'mt-baker', name: 'Mt. Baker', city: 'Deming', state: 'WA', country: 'US', latitude: 48.8574, longitude: -121.6644, baseElevation: 3500, summitElevation: 5089, region: 'Pacific NW', ikonPass: false, epicPass: false },
  { id: 'crystal', name: 'Crystal Mountain', city: 'Enumclaw', state: 'WA', country: 'US', latitude: 46.9282, longitude: -121.5045, baseElevation: 4400, summitElevation: 7012, region: 'Pacific NW', ikonPass: true, epicPass: false },
  { id: 'stevens', name: 'Stevens Pass', city: 'Skykomish', state: 'WA', country: 'US', latitude: 47.7448, longitude: -121.0890, baseElevation: 4061, summitElevation: 5845, region: 'Pacific NW', ikonPass: true, epicPass: false },
  { id: 'snoqualmie', name: 'Summit at Snoqualmie', city: 'Snoqualmie Pass', state: 'WA', country: 'US', latitude: 47.4234, longitude: -121.4072, baseElevation: 3100, summitElevation: 3920, region: 'Pacific NW', ikonPass: false, epicPass: true },
  { id: 'mt-hood-meadows', name: 'Mt. Hood Meadows', city: 'Mt. Hood', state: 'OR', country: 'US', latitude: 45.3314, longitude: -121.6651, baseElevation: 4523, summitElevation: 7300, region: 'Pacific NW', ikonPass: false, epicPass: false },
  { id: 'timberline', name: 'Timberline Lodge', city: 'Government Camp', state: 'OR', country: 'US', latitude: 45.3311, longitude: -121.7113, baseElevation: 4540, summitElevation: 8540, region: 'Pacific NW', ikonPass: false, epicPass: false },
  { id: 'mt-bachelor', name: 'Mt. Bachelor', city: 'Bend', state: 'OR', country: 'US', latitude: 43.9793, longitude: -121.6886, baseElevation: 5700, summitElevation: 9065, region: 'Pacific NW', ikonPass: true, epicPass: false },
  { id: 'mission-ridge', name: 'Mission Ridge', city: 'Wenatchee', state: 'WA', country: 'US', latitude: 47.2929, longitude: -120.3985, baseElevation: 4570, summitElevation: 6820, region: 'Pacific NW', ikonPass: false, epicPass: false },

  // New Mexico
  { id: 'taos', name: 'Taos Ski Valley', city: 'Taos Ski Valley', state: 'NM', country: 'US', latitude: 36.5969, longitude: -105.4544, baseElevation: 9207, summitElevation: 12481, region: 'New Mexico', ikonPass: true, epicPass: false },
  { id: 'angel-fire', name: 'Angel Fire', city: 'Angel Fire', state: 'NM', country: 'US', latitude: 36.3900, longitude: -105.2856, baseElevation: 8600, summitElevation: 10677, region: 'New Mexico', ikonPass: false, epicPass: false },
  { id: 'ski-santa-fe', name: 'Ski Santa Fe', city: 'Santa Fe', state: 'NM', country: 'US', latitude: 35.7959, longitude: -105.8048, baseElevation: 10350, summitElevation: 12075, region: 'New Mexico', ikonPass: false, epicPass: false },

  // Vermont
  { id: 'stowe', name: 'Stowe', city: 'Stowe', state: 'VT', country: 'US', latitude: 44.5303, longitude: -72.7814, baseElevation: 1559, summitElevation: 3640, region: 'Northeast', ikonPass: false, epicPass: true },
  { id: 'killington', name: 'Killington', city: 'Killington', state: 'VT', country: 'US', latitude: 43.6045, longitude: -72.8201, baseElevation: 1165, summitElevation: 4241, region: 'Northeast', ikonPass: false, epicPass: false },
  { id: 'sugarbush', name: 'Sugarbush', city: 'Warren', state: 'VT', country: 'US', latitude: 44.1358, longitude: -72.9013, baseElevation: 1483, summitElevation: 4083, region: 'Northeast', ikonPass: true, epicPass: false },
  { id: 'jay-peak', name: 'Jay Peak', city: 'Jay', state: 'VT', country: 'US', latitude: 44.9268, longitude: -72.5288, baseElevation: 1815, summitElevation: 3968, region: 'Northeast', ikonPass: false, epicPass: false },
  { id: 'mad-river', name: 'Mad River Glen', city: 'Waitsfield', state: 'VT', country: 'US', latitude: 44.2044, longitude: -72.9183, baseElevation: 1600, summitElevation: 3637, region: 'Northeast', ikonPass: false, epicPass: false },
  { id: 'okemo', name: 'Okemo', city: 'Ludlow', state: 'VT', country: 'US', latitude: 43.4015, longitude: -72.7170, baseElevation: 1144, summitElevation: 3344, region: 'Northeast', ikonPass: false, epicPass: true },
  { id: 'mount-snow', name: 'Mount Snow', city: 'West Dover', state: 'VT', country: 'US', latitude: 42.9606, longitude: -72.9226, baseElevation: 1600, summitElevation: 3600, region: 'Northeast', ikonPass: false, epicPass: true },
  { id: 'stratton', name: 'Stratton', city: 'Stratton Mountain', state: 'VT', country: 'US', latitude: 43.1154, longitude: -72.9079, baseElevation: 1872, summitElevation: 3875, region: 'Northeast', ikonPass: true, epicPass: false },
  { id: 'smugglers', name: "Smugglers' Notch", city: 'Jeffersonville', state: 'VT', country: 'US', latitude: 44.5876, longitude: -72.7924, baseElevation: 1030, summitElevation: 3640, region: 'Northeast', ikonPass: false, epicPass: false },

  // New Hampshire
  { id: 'cannon', name: 'Cannon Mountain', city: 'Franconia', state: 'NH', country: 'US', latitude: 44.1565, longitude: -71.6987, baseElevation: 2000, summitElevation: 4080, region: 'Northeast', ikonPass: false, epicPass: false },
  { id: 'wildcat', name: 'Wildcat Mountain', city: 'Gorham', state: 'NH', country: 'US', latitude: 44.2636, longitude: -71.2399, baseElevation: 1867, summitElevation: 4062, region: 'Northeast', ikonPass: false, epicPass: true },
  { id: 'attitash', name: 'Attitash', city: 'Bartlett', state: 'NH', country: 'US', latitude: 44.0820, longitude: -71.2407, baseElevation: 820, summitElevation: 2350, region: 'Northeast', ikonPass: false, epicPass: true },
  { id: 'loon', name: 'Loon Mountain', city: 'Lincoln', state: 'NH', country: 'US', latitude: 44.0369, longitude: -71.6215, baseElevation: 950, summitElevation: 3050, region: 'Northeast', ikonPass: true, epicPass: false },
  { id: 'bretton-woods', name: 'Bretton Woods', city: 'Bretton Woods', state: 'NH', country: 'US', latitude: 44.2554, longitude: -71.4620, baseElevation: 1500, summitElevation: 3100, region: 'Northeast', ikonPass: true, epicPass: false },
  { id: 'sunday-river', name: 'Sunday River', city: 'Newry', state: 'ME', country: 'US', latitude: 44.4705, longitude: -70.8559, baseElevation: 860, summitElevation: 3140, region: 'Northeast', ikonPass: true, epicPass: false },
  { id: 'sugarloaf', name: 'Sugarloaf', city: 'Carrabassett Valley', state: 'ME', country: 'US', latitude: 45.0339, longitude: -70.3134, baseElevation: 1394, summitElevation: 4237, region: 'Northeast', ikonPass: true, epicPass: false },

  // New York
  { id: 'whiteface', name: 'Whiteface', city: 'Wilmington', state: 'NY', country: 'US', latitude: 44.3659, longitude: -73.9026, baseElevation: 1220, summitElevation: 4867, region: 'Northeast', ikonPass: false, epicPass: false },
  { id: 'gore', name: 'Gore Mountain', city: 'North Creek', state: 'NY', country: 'US', latitude: 43.6719, longitude: -74.0062, baseElevation: 1525, summitElevation: 3600, region: 'Northeast', ikonPass: false, epicPass: false },
  { id: 'hunter', name: 'Hunter Mountain', city: 'Hunter', state: 'NY', country: 'US', latitude: 42.2018, longitude: -74.2262, baseElevation: 1600, summitElevation: 3200, region: 'Northeast', ikonPass: false, epicPass: true },

  // West Virginia
  { id: 'snowshoe', name: 'Snowshoe', city: 'Snowshoe', state: 'WV', country: 'US', latitude: 38.4031, longitude: -79.9914, baseElevation: 3700, summitElevation: 4848, region: 'Northeast', ikonPass: true, epicPass: false },

  // British Columbia
  { id: 'whistler', name: 'Whistler Blackcomb', city: 'Whistler', state: 'BC', country: 'CA', latitude: 50.1163, longitude: -122.9574, baseElevation: 2140, summitElevation: 7494, region: 'British Columbia', ikonPass: true, epicPass: true },
  { id: 'revelstoke', name: 'Revelstoke', city: 'Revelstoke', state: 'BC', country: 'CA', latitude: 51.0045, longitude: -118.1640, baseElevation: 1680, summitElevation: 7300, region: 'British Columbia', ikonPass: true, epicPass: false },
  { id: 'kicking-horse', name: 'Kicking Horse', city: 'Golden', state: 'BC', country: 'CA', latitude: 51.2975, longitude: -116.9519, baseElevation: 3900, summitElevation: 8033, region: 'British Columbia', ikonPass: true, epicPass: false },
  { id: 'fernie', name: 'Fernie Alpine', city: 'Fernie', state: 'BC', country: 'CA', latitude: 49.4627, longitude: -115.0872, baseElevation: 3550, summitElevation: 6316, region: 'British Columbia', ikonPass: true, epicPass: false },
  { id: 'red-mountain', name: 'Red Mountain', city: 'Rossland', state: 'BC', country: 'CA', latitude: 49.1042, longitude: -117.8453, baseElevation: 3888, summitElevation: 6800, region: 'British Columbia', ikonPass: false, epicPass: false },

  // Alberta
  { id: 'lake-louise', name: 'Lake Louise', city: 'Lake Louise', state: 'AB', country: 'CA', latitude: 51.4254, longitude: -116.1773, baseElevation: 5400, summitElevation: 8650, region: 'Alberta', ikonPass: true, epicPass: false },
  { id: 'sunshine', name: 'Sunshine Village', city: 'Banff', state: 'AB', country: 'CA', latitude: 51.0715, longitude: -115.7727, baseElevation: 5440, summitElevation: 8954, region: 'Alberta', ikonPass: true, epicPass: false },
  { id: 'norquay', name: 'Mt. Norquay', city: 'Banff', state: 'AB', country: 'CA', latitude: 51.2047, longitude: -115.6038, baseElevation: 5350, summitElevation: 8040, region: 'Alberta', ikonPass: true, epicPass: false },
  { id: 'marmot', name: 'Marmot Basin', city: 'Jasper', state: 'AB', country: 'CA', latitude: 52.8016, longitude: -118.0823, baseElevation: 5570, summitElevation: 8534, region: 'Alberta', ikonPass: false, epicPass: false },

  // Ontario
  { id: 'blue-mountain-on', name: 'Blue Mountain', city: 'Collingwood', state: 'ON', country: 'CA', latitude: 44.5006, longitude: -80.3161, baseElevation: 587, summitElevation: 1148, region: 'Ontario', ikonPass: true, epicPass: false },

  // Quebec
  { id: 'tremblant', name: 'Mont Tremblant', city: 'Mont-Tremblant', state: 'QC', country: 'CA', latitude: 46.2097, longitude: -74.5858, baseElevation: 755, summitElevation: 2871, region: 'Quebec', ikonPass: true, epicPass: false },
  { id: 'le-massif', name: 'Le Massif', city: 'Petite-Riviere-Saint-Francois', state: 'QC', country: 'CA', latitude: 47.2767, longitude: -70.6313, baseElevation: 30, summitElevation: 2646, region: 'Quebec', ikonPass: false, epicPass: false },

  // Japan
  { id: 'niseko-united', name: 'Niseko United', city: 'Niseko', state: 'Hokkaido', country: 'JP', latitude: 42.8029, longitude: 140.6881, baseElevation: 820, summitElevation: 1308, region: 'Japan', ikonPass: true, epicPass: false },
  { id: 'furano', name: 'Furano', city: 'Furano', state: 'Hokkaido', country: 'JP', latitude: 43.3563, longitude: 142.3831, baseElevation: 610, summitElevation: 1208, region: 'Japan', ikonPass: true, epicPass: false },
  { id: 'rusutsu', name: 'Rusutsu', city: 'Rusutsu', state: 'Hokkaido', country: 'JP', latitude: 42.7427, longitude: 140.9008, baseElevation: 810, summitElevation: 1156, region: 'Japan', ikonPass: false, epicPass: false },
  { id: 'hakuba-valley', name: 'Hakuba Valley', city: 'Hakuba', state: 'Nagano', country: 'JP', latitude: 36.6989, longitude: 137.8529, baseElevation: 760, summitElevation: 1831, region: 'Japan', ikonPass: true, epicPass: false },
  { id: 'nozawa-onsen', name: 'Nozawa Onsen', city: 'Nozawaonsen', state: 'Nagano', country: 'JP', latitude: 36.9328, longitude: 138.4382, baseElevation: 1085, summitElevation: 1650, region: 'Japan', ikonPass: true, epicPass: false },
  { id: 'shiga-kogen', name: 'Shiga Kogen', city: 'Yamanouchi', state: 'Nagano', country: 'JP', latitude: 36.7336, longitude: 138.4951, baseElevation: 1340, summitElevation: 2307, region: 'Japan', ikonPass: true, epicPass: false },

  // Alps
  { id: 'verbier', name: 'Verbier (4 Vallées)', city: 'Verbier', state: 'Valais', country: 'CH', latitude: 46.0971, longitude: 7.2279, baseElevation: 1500, summitElevation: 3330, region: 'Alps', ikonPass: false, epicPass: true },
  { id: 'andermatt', name: 'Andermatt-Sedrun', city: 'Andermatt', state: 'Uri', country: 'CH', latitude: 46.6338, longitude: 8.5945, baseElevation: 1444, summitElevation: 2963, region: 'Alps', ikonPass: false, epicPass: true },
  { id: 'les-3-vallees', name: 'Les 3 Vallées', city: 'Courchevel', state: 'Savoie', country: 'FR', latitude: 45.4155, longitude: 6.6340, baseElevation: 1300, summitElevation: 3230, region: 'Alps', ikonPass: false, epicPass: true },
  { id: 'paradiski', name: 'Paradiski', city: 'Les Arcs', state: 'Savoie', country: 'FR', latitude: 45.5539, longitude: 6.8017, baseElevation: 1200, summitElevation: 3226, region: 'Alps', ikonPass: false, epicPass: true },
  { id: 'arlberg', name: 'Ski Arlberg', city: 'St. Anton am Arlberg', state: 'Tyrol', country: 'AT', latitude: 47.1329, longitude: 10.2671, baseElevation: 1304, summitElevation: 2811, region: 'Alps', ikonPass: true, epicPass: false },
  { id: 'zermatt', name: 'Zermatt', city: 'Zermatt', state: 'Valais', country: 'CH', latitude: 46.0207, longitude: 7.7491, baseElevation: 1620, summitElevation: 3883, region: 'Alps', ikonPass: true, epicPass: false },
  { id: 'dolomiti-superski', name: 'Dolomiti Superski', city: 'Ortisei', state: 'South Tyrol', country: 'IT', latitude: 46.5716, longitude: 11.6735, baseElevation: 1224, summitElevation: 2518, region: 'Alps', ikonPass: true, epicPass: false },
  { id: 'chamonix', name: 'Chamonix', city: 'Chamonix-Mont-Blanc', state: 'Haute-Savoie', country: 'FR', latitude: 45.9237, longitude: 6.8694, baseElevation: 1035, summitElevation: 3842, region: 'Alps', ikonPass: true, epicPass: false },

  // Australia / New Zealand
  { id: 'thredbo', name: 'Thredbo', city: 'Thredbo Village', state: 'NSW', country: 'AU', latitude: -36.5043, longitude: 148.2992, baseElevation: 1365, summitElevation: 2037, region: 'Australia/NZ', ikonPass: true, epicPass: false },
  { id: 'mt-buller', name: 'Mount Buller', city: 'Mount Buller', state: 'VIC', country: 'AU', latitude: -37.1527, longitude: 146.4402, baseElevation: 1600, summitElevation: 1805, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'falls-creek', name: 'Falls Creek', city: 'Falls Creek', state: 'VIC', country: 'AU', latitude: -36.8691, longitude: 147.2786, baseElevation: 1500, summitElevation: 1844, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'mt-hotham', name: 'Mt. Hotham', city: 'Hotham Heights', state: 'VIC', country: 'AU', latitude: -36.9919, longitude: 147.1499, baseElevation: 1450, summitElevation: 1861, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'perisher', name: 'Perisher', city: 'Perisher Valley', state: 'NSW', country: 'AU', latitude: -36.4072, longitude: 148.4073, baseElevation: 1720, summitElevation: 2054, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'coronet-peak', name: 'Coronet Peak', city: 'Queenstown', state: 'Otago', country: 'NZ', latitude: -45.0378, longitude: 168.7202, baseElevation: 1170, summitElevation: 1649, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'the-remarkables', name: 'The Remarkables', city: 'Queenstown', state: 'Otago', country: 'NZ', latitude: -45.0806, longitude: 168.7925, baseElevation: 1280, summitElevation: 1943, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'mt-hutt', name: 'Mt. Hutt', city: 'Methven', state: 'Canterbury', country: 'NZ', latitude: -43.5263, longitude: 171.5579, baseElevation: 1431, summitElevation: 2086, region: 'Australia/NZ', ikonPass: false, epicPass: true },
  { id: 'cardrona', name: 'Cardrona', city: 'Wanaka', state: 'Otago', country: 'NZ', latitude: -44.8744, longitude: 169.0129, baseElevation: 1260, summitElevation: 1894, region: 'Australia/NZ', ikonPass: false, epicPass: true },

  // South America
  { id: 'cerro-catedral', name: 'Cerro Catedral', city: 'Bariloche', state: 'Río Negro', country: 'AR', latitude: -41.1856, longitude: -71.4452, baseElevation: 1050, summitElevation: 2388, region: 'South America', ikonPass: true, epicPass: false },
  { id: 'valle-nevado', name: 'Valle Nevado', city: 'Santiago', state: 'Santiago Metropolitan', country: 'CL', latitude: -33.3569, longitude: -70.2992, baseElevation: 2860, summitElevation: 3670, region: 'South America', ikonPass: false, epicPass: false },
  { id: 'el-colorado', name: 'El Colorado', city: 'Santiago', state: 'Santiago Metropolitan', country: 'CL', latitude: -33.3453, longitude: -70.3079, baseElevation: 2430, summitElevation: 3333, region: 'South America', ikonPass: false, epicPass: false },
  { id: 'portillo', name: 'Portillo', city: 'Los Andes', state: 'Valparaíso', country: 'CL', latitude: -32.8488, longitude: -70.1302, baseElevation: 2590, summitElevation: 3310, region: 'South America', ikonPass: false, epicPass: false },
];

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function computeNearbyResorts() {
  const nearby = {};
  for (const resort of resorts) {
    nearby[resort.id] = [];
    for (const other of resorts) {
      if (resort.id === other.id) continue;
      const dist = calculateDistance(resort.latitude, resort.longitude, other.latitude, other.longitude);
      if (dist <= 120) {
        nearby[resort.id].push({ id: other.id, name: other.name, distance: Math.round(dist) });
      }
    }
    nearby[resort.id].sort((a, b) => a.distance - b.distance);
  }
  return nearby;
}

const nearbyResorts = computeNearbyResorts();

module.exports = { resorts, nearbyResorts, calculateDistance };
