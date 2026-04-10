# P4S37L91：Vite 配置文件的基本用法

---



## 1 概况

`Vite` 的配置文件默认为 **项目根目录下** 的 `vite.config.js` 文件，最基本的格式为：

```js
export default {
  // 配置选项
}
```

如果 `Vite` 配置文件不在项目根目录下，也可以通过 `--config` 参数手动指定：

```bash
vite --config my-config.js
```

`Vite` 提供了一个工具函数 `defineConfig`，可以 **方便地获取 TypeScript 类型提示**，这对于使用 `TS` 编写配置尤其有用。

所以一般 `Vite` 配置文件的基本格式为：

```js
export default defineConfig({
  // 配置选项
})
```



## 2 Vite 配置的分类

在 `Vite` 中，配置大致分为这么几类：

1. 普通配置：设置项目的基本选项，别名、根目录、插件……
2. 开发服务器配置：开发服务器的功能，开发服务器的端口、代理、`CORS`……
3. 构建配置：构建生产版本时候的配置，输出目录、压缩、`CSS` 代码拆分……
4. 预览配置：配置预览服务器的行为，端口、主机名……
5. 依赖优化配置：针对依赖预打包做一些配置，比如可以新增包或者排除包
6. `SSR` 配置：服务器端渲染相关配置
7. `Worker` 配置：即 `Web Worker` 相关配置



## 3 普通配置

### 3.1 root

- 类型：`string`；
- 默认值：`process.cwd()`，即 **项目根目录**；
- 描述：用于设置 **index.html 文件的所在文件夹**，可以是绝对路径，也可以是相对于当前工作目录的路径。

例如：

```bash
my-project/
├── public/
│   └── index.html
├── src/
│   ├── main.js
│   └── App.vue
└── vite.config.js
```

此时就可以使用 `root` 属性来配置：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public', // 将项目根目录设置为 'public' 文件夹
});
```



### 3.2 define

- 类型：`Record<string, any>`

- 描述：**定义全局常量替换**。在开发过程中，这些条目将被定义为全局变量。被定义为全局变量意味着无需通过 `import` 来导入，直接使用；在构建过程中会被静态替换：

  ```js
  export default defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify('v1.0.0'),
      __API_URL__: 'window.__backend_api_url',
    },
  })
  ```

>[!note]
>
>**注意**
>
>`Vite` 使用 `esbuild` 的 `define` 进行替换，因此值表达式必须是包含 **JSON 可序列化**的 值（`null`、`boolean`、`number`、`string`、`array`、`object`）的字符串或单个标识符。对于非字符串值，`Vite` 会自动将其转换为 `JSON` 字符串。



### 3.3 resolve

`resolve` 对应的值是一个 **对象**，其中对应若干项配置——

#### 1 alias

用于配置 **路径解析的别名**，这样可以简化模块路径引用：

```js
// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // 将 '@' 指向 'src' 目录
      '@': path.resolve(__dirname, 'src'), 
      // 将 '@components' 指向 'src/components' 目录
      '@components': path.resolve(__dirname, 'src/components'), 
      // 将 '@utils' 指向 'src/utils' 目录
      '@utils': path.resolve(__dirname, 'src/utils'), 
    },
  },
});
```

实测时已改为 `L11` 中的写法了（`Vite v5.3.1`）：

```js
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

```

之后在代码中就可以通过别名来指定目录：

```js
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import HelloWorld from '@components/HelloWorld.vue'; // 使用 '@components' alias
import { helperFunction } from '@utils/helpers'; // 使用 '@utils' alias

createApp(App).mount('#app');
```



#### 2 extensions

在导入时省略文件扩展名时，尝试的文件扩展名列表。

> [!note]
>
> **注意**
>
> 不推荐对自定义导入类型（如 `.vue`）省略扩展名，因为这可能会干扰 `IDE` 和类型支持。

默认值为 `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

可以自定义扩展名的顺序，比如优先匹配 `.ts` 类型：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'], // 自定义扩展名顺序
  },
});
```



### 3.4 CSS

`CSS` 配置项对应的值同样是一个 **对象**，一个基本的格式如下：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    // 其他配置项
  }
});
```

下面是一个常见的配置项：

#### 1 postcss

用于 **配置 PostCSS 的行为**，可以是 **内联的 PostCSS 配置**，也可以是 **自定义目录**。

:one: 内联 `PostCSS` 配置：

```js
// vite.config.js
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default defineConfig({
  css: {
    postcss: {
      // 在这里配置 postcss 相关信息，例如用哪个插件....
      plugins: [
        autoprefixer(),
        cssnano()
      ]
    }
  }
});
```

:two: 自定义目录：

```
my-project/
├── config/
│   └── postcss.config.js
├── src/
│   └── main.js
└── vite.config.js
```

这个时候直接指定 `postcss` 配置文件所在的文件夹即可：

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: 'config' // 指定自定义目录
  }
});
```



#### 2 preprocessorOptions

该配置项用于为 **CSS 预处理器** 指定配置，**文件扩展名** 用于 **作为键（key）**来设置选项。每个预处理器支持的选项可以在它们各自的文档中找到：

- [Sass/Scss](https://sass-lang.com/documentation/js-api/interfaces/legacystringoptions/) 支持的配置选项
- [Less](https://lesscss.org/usage/#less-options) 支持的配置选项
- `styl/stylus`：目前仅支持 [define](https://stylus-lang.com/docs/js.html#define-name-node)，可以作为对象传递。

```js
export default defineConfig({
  css: {
    // 配置 css 预处理器
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        // 目前仅支持 define
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
  },
})
```



#### 3 preprocessorOptions[ext].additionalData

当你想要为 `CSS` 预处理器（如 `SCSS`、`SASS`、`Less` 等）添加全局样式、变量、或混合器时，该选项非常有用。

示例1：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 这里添加了一些全局变量，之后在任何的 Scss 文件中都可以使用这些全局变量
        additionalData: `$injectedColor: orange; $defaultMargin: 10px;`
      }
    }
  }
});
```

示例2：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 相当于给所有的 Scss 文件的头部都添加了这个引用，自动导入 mixins.scss 混合器文件
        additionalData: `@import "@/styles/mixins.scss";`
      }
    }
  }
});
```



#### 4 preprocessorMaxWorkers

如果启用了这个选项，那么 `CSS` 预处理器会尽可能在 `worker` 线程中运行。可以设置 `number` 值，也可以设置布尔值，例如设置成 `true` 的话表示 `CPU` 数量减 1。



#### 5 devSourcemap

控制在开发过程中是否启用 `Source Map`，默认值为 `false`：

```js
export default defineConfig({
  css: {
    // 开启 source maps
    devSourcemap: true
  }
});
```



#### 6 transformer

指定 `CSS` 的处理引擎，可以设置的值就两个，`'postcss'` 或者 `'lightningcss'`

> [!tip]
>
> `lightingcss` 即 `postcss` 的 `Rust` “锈化”版。



## 4 服务器配置

服务器配置是指 **开发服务器**，对应的配置项是 `server`

一个基本的格式如下：

```js
export default defineConfig({
  server: {
    // 众多配置项
  },
})
```

下面是一个常见的配置项：

### 4.1 host

指定服务器应该监听哪个 IP 地址，默认是 `localhost`.

类型： `string | boolean` 

默认： `'localhost'`

> [!tip]
>
> **思考**
>
> 正常情况下就是 `localhost` 就好了呀，什么情况下还存在要修改 `host` 的情况呢？
>
> 答：除了 `localhost` 以外，我们经常还需要设置为 `0.0.0.0` 或者 `true`，表示监听所有的网络接口请求。有些时候需要多设备来测试应用。



### 4.2 port

监听的端口号，默认是 `5173`.



### 4.3 strictPort

如果设置为 `true`，`Vite` 将 **严格使用指定的端口**。如果端口被占用，服务器启动将失败。



### 4.4 proxy

这个配置项非常常用，用于 **配置代理服务器**。

```js
export default defineConfig({
  server: {
    proxy: {
      '/foo': 'http://localhost:4567', // 将 '/foo' 前缀的请求代理到 'http://localhost:4567'
    },
  },
});
```

对应的值也可以是 **对象的形式**，对象形式能够包含更多的配置选项：

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，将 '/api' 前缀去掉
      },
    },
  },
});
```



### 4.5 open

启动开发服务器时 **是否自动在浏览器中打开应用**，默认值是 `false`.



### 4.6 https

是否启用 `HTTPS`。如果是一个对象，可以指定 **SSL 证书** 和 **私钥** 的路径。

```js
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt')
    }
  },
});
```



### 4.7 watch

自定义文件监视器的选项。这对于开发过程中的热模块替换（`HMR`）非常关键。背后其实使用的是 `chokidar`，一个 `Node.js` 的文件系统监听库，它提供了多种可配置的监听选项：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      // 任何位于 ignored-directory 目录下的文件
      // 或者任何目录下面的 some-specific-file.txt 文件
      // 内容发生更改都不会触发 HMR
      ignored: ['**/ignored-directory/**', '**/some-specific-file.txt']
    }
  }
});
```

`watch` 还支持更加细粒度的控制：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: '**/temp/**', // 忽略 temp 目录
      persistent: true,      // 持续监听变化
      usePolling: true,      // 使用轮询
      interval: 100,         // 轮询间隔 100 毫秒
      binaryInterval: 300    // 对于二进制文件的轮询间隔
    }
  }
});
```

如果想要关闭文件监听，直接设置为 `null` 即可：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: null
  }
});
```



这里介绍的都是一些比较常用的配置项。至于其他的配置项，后面用到哪项再来具体介绍。


