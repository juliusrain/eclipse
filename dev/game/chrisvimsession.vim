let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
inoremap <S-Tab> 
vnoremap  :s/^/\/\/
nnoremap  :s/^/\/\/
nnoremap  h
vnoremap 	 >gv
nnoremap 	 >l
nnoremap <NL> j
nnoremap  k
nnoremap  l
nnoremap  :tabnew
nnoremap  :tabclose
nnoremap  s :wa
nnoremap  l a 
nnoremap  h i  
nnoremap  k O
nnoremap  j o
nnoremap  w :wa
vnoremap C :s/^\/\//
nnoremap C :s/^\/\//
nmap gx <Plug>NetrwBrowseX
nnoremap tc :tabclose
nnoremap tn :tabnew
noremap <F5> :nohls
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#NetrwBrowseX(expand("<cWORD>"),0)
nnoremap <C-Left> :tabprevious
nnoremap <C-Right> :tabnext
vnoremap <S-Tab> <gv
nnoremap <S-Tab> <h
noremap <F4> :nohls
inoremap jj 
cnoremap tc tabclose
cnoremap tn tabnew
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set background=dark
set backspace=indent,eol,start
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set helplang=en
set history=50
set hlsearch
set incsearch
set listchars=tab:»·,trail:·
set mouse=a
set printoptions=paper:letter
set ruler
set runtimepath=~/.vim,/var/lib/vim/addons,/usr/share/vim/vimfiles,/usr/share/vim/vim73,/usr/share/vim/vimfiles/after,/var/lib/vim/addons/after,~/.vim/after
set shiftwidth=4
set showtabline=2
set smartindent
set suffixes=.bak,~,.swp,.o,.info,.aux,.log,.dvi,.bbl,.blg,.brf,.cb,.ind,.idx,.ilg,.inx,.out,.toc
set tabstop=4
set wildignore=*.swp,*~
set wildmenu
set wildmode=list:longest,full
set window=65
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/school/computer_science/361/repo/361project/dev/game
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +450 GraphicsEngine.js
badd +1 \[
badd +0 testobjects.js
args GraphicsEngine.js
edit GraphicsEngine.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
exe 'vert 1resize ' . ((&columns * 114 + 119) / 238)
exe 'vert 2resize ' . ((&columns * 123 + 119) / 238)
argglobal
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=4
setlocal foldmarker={{{,}}}
setlocal foldmethod=syntax
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
set list
setlocal list
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal smartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
161
normal zo
161
normal zo
281
normal zo
440
normal zo
486
normal zo
526
normal zo
531
normal zo
537
normal zo
544
normal zo
576
normal zo
591
normal zo
544
normal zo
627
normal zo
638
normal zo
642
normal zo
651
normal zo
654
normal zo
657
normal zo
661
normal zo
666
normal zo
670
normal zo
690
normal zo
699
normal zo
690
normal zo
706
normal zo
714
normal zo
706
normal zo
733
normal zo
746
normal zo
749
normal zo
789
normal zo
746
normal zo
839
normal zo
866
normal zo
875
normal zo
886
normal zo
888
normal zo
891
normal zo
898
normal zo
937
normal zo
968
normal zo
979
normal zo
985
normal zo
891
normal zo
670
normal zo
486
normal zo
440
normal zo
526
normal zo
531
normal zo
537
normal zo
544
normal zo
575
normal zo
590
normal zo
544
normal zo
281
normal zo
626
normal zo
637
normal zo
641
normal zo
650
normal zo
653
normal zo
656
normal zo
660
normal zo
665
normal zo
669
normal zo
689
normal zo
698
normal zo
689
normal zo
705
normal zo
713
normal zo
732
normal zo
745
normal zo
748
normal zo
788
normal zo
745
normal zo
838
normal zo
865
normal zo
874
normal zo
885
normal zo
887
normal zo
890
normal zo
897
normal zo
936
normal zo
969
normal zo
980
normal zo
986
normal zo
890
normal zo
705
normal zo
732
normal zo
745
normal zo
748
normal zo
788
normal zo
745
normal zo
838
normal zo
865
normal zo
874
normal zo
885
normal zo
887
normal zo
669
normal zo
890
normal zo
890
normal zo
897
normal zo
903
normal zo
944
normal zo
970
normal zo
981
normal zo
987
normal zo
890
normal zo
890
normal zo
let s:l = 577 - ((0 * winheight(0) + 31) / 63)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
577
normal! 058l
wincmd w
argglobal
edit GraphicsEngine.js
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=4
setlocal foldmarker={{{,}}}
setlocal foldmethod=syntax
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
set list
setlocal list
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal smartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
9
normal zo
9
normal zo
137
normal zo
161
normal zo
161
normal zo
281
normal zo
393
normal zo
440
normal zo
440
normal zo
526
normal zo
531
normal zo
537
normal zo
544
normal zo
575
normal zo
590
normal zo
544
normal zo
281
normal zo
626
normal zo
637
normal zo
641
normal zo
650
normal zo
653
normal zo
656
normal zo
660
normal zo
665
normal zo
669
normal zo
689
normal zo
698
normal zo
689
normal zo
705
normal zo
713
normal zo
732
normal zo
745
normal zo
748
normal zo
788
normal zo
745
normal zo
838
normal zo
865
normal zo
874
normal zo
885
normal zo
887
normal zo
890
normal zo
897
normal zo
936
normal zo
969
normal zo
980
normal zo
986
normal zo
890
normal zo
705
normal zo
732
normal zo
745
normal zo
748
normal zo
788
normal zo
745
normal zo
838
normal zo
865
normal zo
874
normal zo
885
normal zo
887
normal zo
669
normal zo
890
normal zo
890
normal zo
897
normal zo
903
normal zo
944
normal zo
970
normal zo
981
normal zo
987
normal zo
890
normal zo
890
normal zo
let s:l = 610 - ((33 * winheight(0) + 31) / 63)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
610
normal! 045l
wincmd w
exe 'vert 1resize ' . ((&columns * 114 + 119) / 238)
exe 'vert 2resize ' . ((&columns * 123 + 119) / 238)
tabedit testobjects.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=4
setlocal foldmarker={{{,}}}
setlocal foldmethod=syntax
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
set list
setlocal list
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal smartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
67
normal zo
105
normal zo
let s:l = 69 - ((0 * winheight(0) + 32) / 64)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
69
normal! 011l
tabnext 1
if exists('s:wipebuf')
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :