// tsup.config.ts
import { defineConfig } from "tsup";
import { glob } from "glob";
var tsup_config_default = defineConfig(() => {
  const component = process.env.COMPONENT;
  const entry = component ? glob.sync(`src/components/**/${component}/index.{ts,tsx}`) : ["src/index.ts"];
  if (component && entry.length === 0) {
    console.error(`Component "${component}" not found!`);
    process.exit(1);
  }
  return {
    entry,
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: component ? `dist/${component}` : "dist",
    external: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled"
    ]
  };
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdGhvbWZpbGcvcC9wcm9jdXJlbWVudC9wYWNrYWdlcy91aS90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS90aG9tZmlsZy9wL3Byb2N1cmVtZW50L3BhY2thZ2VzL3VpXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL3Rob21maWxnL3AvcHJvY3VyZW1lbnQvcGFja2FnZXMvdWkvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJztcbmltcG9ydCB7IGdsb2IgfSBmcm9tICdnbG9iJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+IHtcbiAgY29uc3QgY29tcG9uZW50ID0gcHJvY2Vzcy5lbnYuQ09NUE9ORU5UO1xuXG4gIGNvbnN0IGVudHJ5ID0gY29tcG9uZW50XG4gICAgPyBnbG9iLnN5bmMoYHNyYy9jb21wb25lbnRzLyoqLyR7Y29tcG9uZW50fS9pbmRleC57dHMsdHN4fWApXG4gICAgOiBbJ3NyYy9pbmRleC50cyddO1xuXG4gIGlmIChjb21wb25lbnQgJiYgZW50cnkubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKGBDb21wb25lbnQgXCIke2NvbXBvbmVudH1cIiBub3QgZm91bmQhYCk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbnRyeSxcbiAgICBmb3JtYXQ6IFsnY2pzJywgJ2VzbSddLFxuICAgIGR0czogdHJ1ZSxcbiAgICBzcGxpdHRpbmc6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBjbGVhbjogdHJ1ZSxcbiAgICBvdXREaXI6IGNvbXBvbmVudCA/IGBkaXN0LyR7Y29tcG9uZW50fWAgOiAnZGlzdCcsXG4gICAgZXh0ZXJuYWw6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdAbXVpL21hdGVyaWFsJyxcbiAgICAgICdAbXVpL2ljb25zLW1hdGVyaWFsJyxcbiAgICAgICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICAnQGVtb3Rpb24vc3R5bGVkJyxcbiAgICBdLFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsb0JBQW9CO0FBQ25TLFNBQVMsWUFBWTtBQUVyQixJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNoQyxRQUFNLFlBQVksUUFBUSxJQUFJO0FBRTlCLFFBQU0sUUFBUSxZQUNWLEtBQUssS0FBSyxxQkFBcUIsU0FBUyxpQkFBaUIsSUFDekQsQ0FBQyxjQUFjO0FBRW5CLE1BQUksYUFBYSxNQUFNLFdBQVcsR0FBRztBQUVuQyxZQUFRLE1BQU0sY0FBYyxTQUFTLGNBQWM7QUFDbkQsWUFBUSxLQUFLLENBQUM7QUFBQSxFQUNoQjtBQUVBLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsSUFDckIsS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsT0FBTztBQUFBLElBQ1AsUUFBUSxZQUFZLFFBQVEsU0FBUyxLQUFLO0FBQUEsSUFDMUMsVUFBVTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
