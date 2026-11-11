import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  timeout:45000,
  expect:{timeout:12000},
  fullyParallel:false,
  workers:1,
  reporter:'list',
  use:{baseURL:'http://127.0.0.1:4173',headless:true,viewport:{width:1440,height:1000},trace:'retain-on-failure'},
  webServer:[
    {command:'node scripts/serve.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:true},
    {command:'node scripts/serve.mjs',env:{PORT:'4174',PREFIX:'/zhengtu-xinhuo/'},url:'http://127.0.0.1:4174/zhengtu-xinhuo/',reuseExistingServer:true},
  ],
});
