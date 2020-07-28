import Vue from 'vue';

const capitalizeFirstLetter = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

const requireComponent = require.context('.', false, /\.vue$/);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = capitalizeFirstLetter(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''));
  Vue.component(componentName, componentConfig.default || componentConfig);
});
