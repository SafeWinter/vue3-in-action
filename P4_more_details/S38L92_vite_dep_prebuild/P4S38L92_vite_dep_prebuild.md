# P4S38L92：Vite 中的依赖预构建

---



## 1 什么是依赖预构建

一言以蔽之：在 **首次** 使用 `Vite` 启动项目时，将项目 **依赖** 预先构建一遍。

> [!tip]
>
> 思考🤔
>
> 前面不是说 `Vite` 相比 `Webpack` 的优点不就是不打包么？这里预构建又是怎么一回事儿？



不进行预构建面临的问题：

1. 依赖文件过多，导致请求过多；
2. 某些依赖仍然是以 `CommonJS` 格式发布的，它们并不兼容原生 `ESM` 环境。

为此，`Vite` 在第一次启动项目时会针对 **依赖** 进行预构建（打包）。

预构建阶段所使用的打包工具是 [esbuild](https://esbuild.github.io/)，这是一个用 `Go` 语言编写的构建工具，效率极高，**大部分工作都是并行处理的**。`esbuild` 能够迅速将依赖转换为有效的 `ES` 模块格式，并进行打包，从而优化依赖管理和加载效率。

`esbuild` 的主要工作：

1. 转换：将一些 `CommonJS`、`UMD` 格式的模块转换为 `ES` 模块格式。
2. 编译打包：针对依赖进行打包，减少浏览器在开发环境请求的次数。
3. 最小化和压缩：这个是在构建阶段，针对代码的最小化和压缩也是 `esbuild` 来做的。



## 2 缓存

缓存分为两种：

1. 文件缓存
2. 浏览器缓存

针对依赖项做构建后，会将构建产物做缓存，缓存到 `node_modules/.vite/` 目录下。

重新触发预构建的时机：

- 包管理器的锁文件内容，例如 `package-lock.json`，`yarn.lock`，`pnpm-lock.yaml`，或者 `bun.lockb` [^1] 发生了变化；
- 补丁文件夹的修改时间发生了变化；
- `vite.config.js` 中的相关字段发生了变化，在配置文件中也存在依赖预构建的相关配置，依赖预构建相关配置发生了变化，自然需要重新预构建。
- `NODE_ENV` 的值变动；

上述任意一项发生更改时，需要重新运行预构建。



另外，已预构建的依赖，**在浏览器端也会存在缓存**。会使用 `HTTP Header` 头的 `max-age=31536000, immutable` 进行 **强缓存**，以提高开发期间页面重新加载的性能。一旦被缓存，这些请求将永远不会再次访问开发服务器。

如果安装了不同版本的依赖项（这反映在包管理器的 `lockfile` 中），则会通过附加版本查询把之前的强缓存自动失效。

例如：当前项目使用了 `lodash`，当前版本为 `4.17.19`：

```url
http://localhost:3000/node_modules/.vite/lodash.js?v=4.17.19
```

之后对 `lodash` 版本升级，升级到 `4.17.20`，锁文件内容变化会导致重新预构建：

```url
http://localhost:3000/node_modules/.vite/lodash.js?v=4.17.20
```

`URL` 发生变化后，浏览器就会发生新的请求到开发服务器，而不再使用旧的缓存。



## 3 预构建行为的自定义

在配置文件中，通过 `optimizeDeps` 对预构建行为进行配置。其基本格式为：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    // 其他的配置
  }
});
```



### 3.1 entries

默认情况下，**Vite 会抓取 index.html 来检测需要预构建的依赖项**（忽略 `node_modules`、`build.outDir`、\_`_tests__` 和 `coverage`）。

**如果指定了 build.rollupOptions.input，Vite 将转而去抓取这些入口点**。

如果这两者都不合意，则可以使用 **entries 选项** 指定自定义条目，在 `Vite` 中明确指定应当被预构建的 **依赖入口**。

示例项目结构：

```
my-project/
├── src/
│   ├── main.js         // 主入口文件
│   ├── admin.js        // 管理员入口文件
│   └── vendor/
│       └── custom.js   // 自定义库
├── index.html
└── vite.config.js
```

示例1：基本用法：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    entries: ['src/main.js', 'src/admin.js']  // 显式指定入口文件
  }
});
```

示例2：使用 `glob` 模式：

```js
// vite.config.js
import { defineConfig } from 'vite';

export.default defineConfig({
  optimizeDeps: {
    // vite会扫描src目录下面的所有的.js文件，之后会将这些文件引用的依赖做一个预构建处理
    entries: ['src/**/*.js']  // 使用 glob 模式匹配所有 JS 文件
  }
});
```

示例3：忽略特定目录：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    entries: [
      'src/**/*.js',              // 匹配所有 JS 文件
      '!src/experimental/**/*.js' // 但忽略 experimental 目录
    ]
  }
});
```



### 3.2 include 和 exclude

`include` 用于包含某个包，`exclude` 用于排除某个包。

默认情况下，预构建主要是针对依赖，也就是 `node_modules` 下面的包。

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```



### 3.3 esbuildOptions

`Vite` 使用 `esbuild` 来预构建项目依赖，以提高开发服务器的启动速度和整体构建性能。

在大多数情况下，`Vite` 的默认设置已经足够高效。然而，有时可能需要对 `esbuild` 的行为进行特定的调整，例如，更改源映射生成、定义宏替换等，以适应特定的项目需求或解决兼容性问题。

示例1：自定义源码映射

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: 'inline'  // 将源映射直接嵌入到输出文件中
    }
  }
});
```

示例2：使用宏替换

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env.NODE_ENV': '"production"',
        '__VERSION__': '"1.0.0"'
      }
    }
  }
});
```

示例3：调整目标 `JavaScript` 版本

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      // esbuild在对依赖进行预构建的时候，会将其编译为ES2015兼容的代码
      target: 'es2015'
    }
  }
});
```



### 3.4 force

设置为 `true` 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖。



---

[^1]: 对于构建工具 `bun`，其项目依赖的锁文件有两种格式：二进制格式的 `bun.lockb`，或者文本格式的 `bun.lock`（较新版本支持）。



