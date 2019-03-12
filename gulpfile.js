 const dir = {
    src         : 'C:/Users/as/Desktop/Astrologer',
    build       : 'C:/wamp64/www/bn/wp-content/themes/Astrologer',
    dist		: 'C:/Users/as/Desktop'
  };

const gulp = require('gulp');
const newer = require('gulp-newer');
const cleanCSS = require('gulp-clean-css');
const uglify   = require('gulp-uglify');
var browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const zip = require('gulp-zip');


//copy core theme files files
const php={
     src : dir.src+"/*.php",
     build : dir.build
};

function phpfiles(done){
	return gulp.src(php.src)
	.pipe(newer(php.build))
	.pipe(gulp.dest(php.build));
	done();
}

const css={
     src : dir.src+"/css/*.css",
     build : dir.build+"/css"
};

function cssfiles(done){
	return gulp.src(css.src)
	.pipe(newer(css.build))
	.pipe(cleanCSS())
    .pipe(gulp.dest(css.build));
    done();
};

function basecssfiles(done){
	return gulp.src(dir.src+"*/.css")
	.pipe(newer(css.build))
	.pipe(cleanCSS())
    .pipe(gulp.dest(dir.build));
    done();
}

/*-----copy Javascript files----------*/
const js = {
	src : dir.src +"/js/*.js",
	build : dir.build+"/js"
};

function jsfiles(done){
	return gulp.src(js.src)
	.pipe(newer(js.build))
    .pipe(gulp.dest(js.build));
    done();
}

const images = {
	src : dir.src +"/images/*.*",
	build : dir.build+"/images"
};

function imagefiles(done){
	return gulp.src(images.src)
	.pipe(newer(images.build))
	.pipe(imagemin())
    .pipe(gulp.dest(images.build));
    done();
}

function include(done){
	return gulp.src(dir.src+"/include/*.php")
	.pipe(newer(dir.build+"/include"))
	.pipe(gulp.dest(dir.build+"/include"));
	done();
}

function meta(done){
	return gulp.src(dir.src+"/meta-box/**/*")
	.pipe(newer(dir.build+"/meta-box"))
	.pipe(gulp.dest(dir.build+"/meta-box"));
	done();
}

/*---------copy general files from source to target*/
function general(done){
	return gulp.src([dir.src+"/*.jpg",dir.src+"/*.png",dir.src+"/*.txt"])
	.pipe(newer(dir.build))
	.pipe(gulp.dest(dir.build));
	done();
}

/*--------copy Theme admin Panel Files----------*/
function corefunction(done){
	return gulp.src(dir.src+"/functions/**/*")
	.pipe(newer(dir.build+"/functions"))
	.pipe(gulp.dest(dir.build+"/functions"));
	done();
}


function zipfiles(done){
	return gulp.src(dir.build+"/**/*")
        .pipe(zip('Astrologer3.zip'))
        .pipe(gulp.dest(dir.dist));
        done();
}


function browser_sync(done) {
    browserSync.init({
        proxy: "localhost/bn"
    });
    done();
};

gulp.task('php', phpfiles);
gulp.task('css', cssfiles);
gulp.task('basecss', basecssfiles);
gulp.task('js', jsfiles);
gulp.task('images', imagefiles);
gulp.task('include', include);
gulp.task('meta', meta);
gulp.task('general', general);
gulp.task('function', corefunction);
gulp.task('zip', zipfiles);
gulp.task('browser-sync',browser_sync);


gulp.task('build',gulp.series('php','css','basecss','js','images','include','meta','general','function','zip'));

function watchfiles(done){
   gulp.watch(php.src,gulp.series('php'));
   gulp.watch(css.src,gulp.series('css'));
   gulp.watch(dir.src+"/*.css",gulp.series('basecss'));
   gulp.watch(js.src, gulp.series('js'));
   gulp.watch(images.src, gulp.series('images'));
   gulp.watch(dir.build).on('change',browserSync.reload);
   done();
}

gulp.task('watch', gulp.series('browser-sync', watchfiles));

gulp.task('default',gulp.series('watch'));