@ echo off

cd .\seniva-cute
for %%i in (*.ogg) do (
    echo %%i
    wrangler r2 object put guc-bise/seniva-cute/%%i --file=%%i
)

pause