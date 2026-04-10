# P4S39L93：Vite 生产环境下的构建配置

---



## 1 构建工具

不同于 **依赖预构建** 用到的 `esbuild`，生产构建使用的工具是 `rollup`. 因为 `rollup` 提供了一些特性和优势，特别适合用于生产环境的代码打包和优化。



### 1.1 代码分割和动态导入

`rollup` 支持高级 **代码分割** 和 **动态导入** 功能，这对于现代前端应用尤为重要。它能够处理复杂的导入场景，例如 **循环依赖** 和 **动态模块路径**，确保最终打包的文件大小最小且模块之间的依赖正确处理。这些功能在大型应用中可以显著提高加载性能和用户体验。



### 1.2 Tree Shaking

虽然 `esbuild` 也支持 `tree shaking` 技术，但 `rollup` 的 `tree shaking` 能力通常被认为 **更为强大和精准**。`rollup` 能够更有效地识别并剔除未使用的代码，这对于减少最终生产包的体积至关重要。



### 1.3 插件生态

rollup 拥有一个成熟且广泛的**插件生态系统**，这使得开发者可以轻松地扩展其构建过程，以适应各种复杂和特定的构建需求。例如，可以通过插件支持各种 CSS 预处理器、图片优化、国际化等。这种灵活性对于生产环境的构建配置是非常有价值的。



### 1.4 输出控制和优化

`rollup` 提供了 **更细粒度的控制输出格式和结构的功能**，这对于需要精确控制文件结构和模块化方式的现代应用开发非常重要。例如，`rollup` 可以生成更为优化的 `ES` 模块代码，这有助于在现代浏览器中实现更好的性能。



### 1.5 生产优化

虽然 `esbuild` 的构建速度非常快，但在生产环境中，构建速度虽重要，**代码质量** 和 **优化程度** 更为关键。`rollup` 在这方面提供了更多的优化策略，如更复杂的代码分割和加载策略，这有助于提高应用的性能和可维护性。



总结起来：不同环境下的打包，我们的目标是不一样

- 开发环境：追求的是构建速度
- 生产环境：更多考虑的是打包出来的代码的质量



## 2 自定义构建

如果仅仅是要把项目构建为生产版本，那非常简单，直接 `npm run build` 即可，背后运行的是 `vite build`：

```js
"scripts": {
  "build": "vite build",
},
```

不过构建生产版本时经常有一些自定义的需求，此时在配置文件里面的 `build` 配置项进行配置，一个基本的格式如下：

```js
export default defineConfig({
  build: {
    // 构建相关的配置
  }
})
```

这里介绍一些常用的配置。



### 2.1 target

该配置项用于定义最终构建产物的 `JS` 版本和浏览器兼容性。这个设置非常关键，因为它直接影响到代码在不同环境中的运行能力以及可能需要的转译级别。我们来看几个例子。

例1：默认设置

`build.target` 的默认值是 `'modules'`，这意味着构建出来的产物适用于现代支持 `ESM` 的浏览器，对应的浏览器版本：

- `Edge 88+`
- `Firefox 78+`
- `Chrome 87+`
- `Safari 14+`

例2：指定 `ES` 版本

```js
export default defineConfig({
  build: {
    target: 'es2015'
  }
});
```

例3：支持特定浏览器版本

```js
export default defineConfig({
  build: {
    target: 'chrome58'
  }
});
```

例4：多目标设置

```js
export default defineConfig({
  build: {
    target: ['es2020', 'firefox78', 'chrome87']
  }
});
```

**注意事项**

- `esbuild` 虽然很快，但可能不支持某些复杂的或尚未广泛采用的 `JS` 特性。如果遇到了这一类 `esbuild` 不支持的特性，那么需要是 `Babel` 来做一个补充编译。
- 更改 `build.target` 会影响构建的输出大小和性能。



### 2.2 outDir

用于指定构建产物的目录，默认是项目根目录下的 `dist`。



### 2.3 assetsDir

指定生成静态资源的存放路径，默认是 `dist/assets`。



### 2.4 cssMinify

`build.cssMinify` 配置项允许你单独控制 `CSS` 文件的最小化压缩方式，独立于 `JS` 的压缩设置。这个选项在优化构建输出时非常有用，尤其是当你需要精确控制 `CSS` 和 `JS` 压缩策略时。下面来举一些例子：

例1：默认行为

默认情况下 `Vite` 使用 `'esbuild'` 来压缩 `CSS`。



例2：使用 `Lightning CSS` 压缩 `CSS`：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssMinify: 'lightningcss'
  }
});
```



例3：禁用 `CSS` 压缩：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssMinify: false
  }
});
```



例4：独立配置 `JS` 和 `CSS` 压缩：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssMinify: 'esbuild', // CSS压缩使用esbuild
    minify: 'terser' // JS压缩使用 terser
  }
});
```



### 2.5 minify

`build.minify` 用于控制构建过程中的 `JS` 代码压缩和混淆，这个设置对于优化生产环境的代码尺寸和性能至关重要。

**默认使用 esbuild 来进行压缩**，它比 `terser` 快 20-40 倍，压缩率只差 1%-2%

如果你需要更高级的压缩选项，或者在某些情况下 `esbuild` 的压缩结果不符合你的需求，你可以选择使用 `terser`。

`terser` 提供了更细致的控制和稍微更好的压缩率，尽管它的速度较慢。

```bash
npm install terser -D
```

```js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'terser' // JS压缩使用 terser
  }
});
```



### 2.6 sourcemap

构建后是否生成 `Source Map` 源码映射文件。

- 如果为 `true`，将会创建一个独立的 `source map` 文件
- 如果为 `'inline'`，`source map` 将作为一个 `data URI` 附加在输出文件中。
- `'hidden'` 的工作原理与 `true` 相似，只是 `bundle` 文件中相应的注释将不被保留。



### 2.7 rollupOptions

因为底层使用的是 `rollup` 进行打包，因此支持所有的 [rollup配置选项](https://rollupjs.org/configuration-options/)。

`rollupOptions` 配置项对应是一个对象，该对象和 `rollup` 配置文件导出的选项相同。

示例：

1. 添加一个 `rollup` 插件来处理图像
2. 指定 `some-external-lib` 为外部依赖
3. 为这个外部依赖提供一个可访问的全局变量 `SomeExternalLib`

配置如下：

```js
import { defineConfig } from 'vite';
import image from '@rollup/plugin-image'; // 假设这是一个用于处理图像的 Rollup 插件

export default defineConfig({
  build: {
    rollupOptions: {
      plugins:[
        images() // 通过这个rollup插件来处理图像
      ],
      external: ['some-external-lib'] // 指定some-external-lib为外部依赖，不会被打包进去
      output: {
      	globals: {
      		'some-external-lib': 'SomeExternalLib'
    		}
    	}
    }
  }
})
```



## 3 公共基础路径

该配置项 **不属于 build 里面的配置项**，但也是一个非常重要的配置项，主要用于配置开发环境和生产环境的基本公共路径。

- 类型：`string`
- 默认值：`'/'`
- 描述：用于配置开发环境和生产环境的基本公共路径，有效值包括：
  - 绝对 `URL` 路径名，例如 `/foo/`
  - 完整 `URL`，例如 https://bar.com/foo/（开发环境中不会使用 `origin` 部分，因此其值与 `/foo/` 相同）
  - 空字符串或 `./`（用于嵌入式部署）

举例：

```js
my-project/
├── public/
│   └── index.html
├── src/
│   ├── main.js
│   └── App.vue
├── vite.config.js
└── package.json
```

配置文件：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/my-app/', // 设置基本公共路径为 '/my-app/'
});
```

之后要访问静态资源的时候，全部会以 `/my-app/` 作为前缀：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
  </head>
  <body>
    <script type="module" src="/my-app/src/main.js"></script>
  </body>
</html>
```

假设项目打包：

```
my-project/
├── dist/
│   ├── assets/
│   │   ├── main.12345.js
│   │   └── style.67890.css
│   └── index.html
└── vite.config.js
```

`dist/index.html`，要访问静态资源，也需要添加公共路径：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="/my-app/assets/style.67890.css">
  </head>
  <body>
    <script type="module" src="/my-app/assets/main.12345.js"></script>
  </body>
</html>
```

> [!tip]
>
> 思考🤔：为什么要配置这么一个路径？
>
> 答案：因为有些时候我们的应用并非部署在根目录下面，而是部署在某一个子路径或者子目录下面，这个时候就需要通过 `base` 保证你的静态资源能够正确被加载。



## 4 库模式

库模式指的是将应用打包成一个依赖库，方便其他应用来使用。这里可以在 `lib` 配置项里面进行配置：

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // ....
    },
  },
})
```

和普通模式区别：

1. 入口文件
   - 普通应用：一般是 `index.html`，所有的资源从这个入口 `HTML` 文件开始加载。
   - 库模式：入口文件通常是一个 `JS` 文件，因为库通常是作为一个资源被其他项目引用
2. 输出格式
   - 普通应用：通过只针对特定的运行环境（大多数浏览器支持即可）进行打包
   - 库模式：往往需要支持多种模块系统，包括 `UMD`、`ESM`、`CommonJS` 这些类型。
3. 外部依赖
   - 普通应用：将所有的依赖打包到一个或者多个文件里面
   - 库模式：往往需要将外部依赖排除掉

总结：在库模式中，需要配置 **入口点、库的名称、输出文件名，以及如何处理外部依赖**。这些配置确保库被打包成适用于不同消费场景的格式。

假设有如下的项目目录：

```
my-lib/
├── lib/
│   ├── main.js        // 库的入口文件
│   ├── Foo.vue        // Vue 组件
│   └── Bar.vue        // 另一个 Vue 组件
├── index.html         // 用于开发测试的 HTML 文件
├── package.json
└── vite.config.js     // Vite 配置文件
```

接下来我们要将其打包成一个库，配置文件如下：

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
      },
    },
  },
})
```

- `entry`：指定库的入口文件
- `name`：指定你的库在 `UMD` 或者 `IIFE` 环境下的全局变量的名称
- `fileName`：最终生成的文件的文件名
- `external`：排除哪些外部依赖
- `globals`：外部依赖在 `UMD` 或者 `IIFE` 格式下全局变量的名称

配置文件完成后，就可以通过 `vite build` 进行库模式的构建

```
my-lib/
├── dist/
│   ├── my-lib.es.js        // ES 模块格式
│   ├── my-lib.umd.js       // UMD 格式
│   └── assets/             // 包含所有静态资源，如编译后的 CSS
└── ...
```

构建出来的产物是多种格式，因为要应对不同的环境下使用这个库。

最后还有一个非常重要的步骤：需要在 `package.json` 里面去配置不同环境的入口文件：

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```

